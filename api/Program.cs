using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Scalar.AspNetCore;
using Souq.Api.Features.Auth;
using Souq.Api.Features.Users;
using Souq.Api.Persistence;
using Souq.Api.Storage;

var builder = WebApplication.CreateBuilder(args);

const long MaxUploadBatchBytes = 100L * 1024 * 1024;

var connectionString = builder.Configuration.GetConnectionString("SouqDb")
    ?? throw new InvalidOperationException("ConnectionStrings:SouqDb is not configured.");

var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();
builder.Services.AddSingleton(dataSource);

builder.Services.AddDbContext<SouqDbContext>(options => options.UseNpgsql(dataSource));

builder.Services.AddScoped<IUserContext, UserContext>();
builder.Services.AddScoped<UsersService>();

builder.Services.Configure<StorageOptions>(builder.Configuration.GetSection("Storage"));
builder.Services.AddSingleton<IObjectStorage, LocalDiskStorage>();
builder.Services.AddSingleton<PhotoProcessor>();
builder.Services.AddHostedService<StorageJanitor>();

builder.Services.Configure<FormOptions>(o =>
{
    o.MultipartBodyLengthLimit = MaxUploadBatchBytes;
    o.ValueCountLimit = 64;
});
builder.WebHost.ConfigureKestrel(o =>
{
    o.Limits.MaxRequestBodySize = MaxUploadBatchBytes;
});

builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("uploads", ctx =>
    {
        var userCtx = ctx.RequestServices.GetService<IUserContext>();
        var key = userCtx?.CurrentUserId?.ToString()
            ?? ctx.Connection.RemoteIpAddress?.ToString()
            ?? "anon";
        return RateLimitPartition.GetFixedWindowLimiter(key, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 50,
            Window = TimeSpan.FromMinutes(10),
            QueueLimit = 0,
        });
    });
});

builder.Services.AddHttpClient();

builder.Services.AddOpenApi();

builder.Services
    .AddControllers()
    .ConfigureApiBehaviorOptions(o =>
    {
        o.SuppressModelStateInvalidFilter = true;
        o.SuppressMapClientErrors = true;
    });

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseMiddleware<SessionAuthMiddleware>();
app.UseRateLimiter();

app.MapOpenApi();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseCors();
    app.MapScalarApiReference();
}

app.Run();
