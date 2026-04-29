-- Souq dev seed data — idempotent.
-- Run: psql -U veliozturk -d souq -v ON_ERROR_STOP=1 -f db/seed.sql

SET search_path = souq, pg_catalog;

TRUNCATE souq.eng_favorites,
         souq.msg_messages,
         souq.ofr_offers,
         souq.msg_conversations,
         souq.bst_boosts,
         souq.lst_listing_photos,
         souq.lst_listings,
         souq.cat_categories,
         souq.cat_conditions,
         souq.loc_neighborhoods,
         souq.usr_users
         RESTART IDENTITY CASCADE;

DO $$
DECLARE
    cnd_new      uuid; cnd_likenew uuid; cnd_good uuid; cnd_fair uuid;
    cat_furn     uuid; cat_elec    uuid; cat_fash uuid; cat_home uuid; cat_sport uuid; cat_other uuid;
    n_marina     uuid; n_dt        uuid; n_jbr    uuid; n_jlt    uuid; n_bb      uuid; n_jum     uuid;
    -- Existing users
    u_aisha      uuid; u_omar      uuid; u_priya  uuid;
    -- New users
    u_rami       uuid; u_khalid    uuid; u_sara   uuid; u_ahmed  uuid; u_layla   uuid;
    u_hassan     uuid; u_noura     uuid; u_rashid uuid; u_fatima uuid; u_yusuf   uuid;
    -- Existing listings
    l_aeron      uuid; l_sofa      uuid; l_iphone uuid; l_dyson  uuid; l_brompton uuid;
    l_switch     uuid; l_armchair  uuid; l_stroller uuid; l_tennis uuid; l_dior   uuid;
    -- New listings (no photos)
    l_velvet     uuid; l_lounge    uuid; l_muji   uuid; l_canyon uuid; l_v11     uuid;
    l_billy      uuid; l_espresso  uuid; l_golf   uuid; l_bunk   uuid; l_drone   uuid;
    -- Conversations
    cnv_1        uuid; cnv_2 uuid; cnv_3 uuid; cnv_4 uuid; cnv_5 uuid;
    cnv_6        uuid; cnv_7 uuid; cnv_8 uuid; cnv_9 uuid;
    -- Offers
    ofr_1        uuid; ofr_2_orig uuid; ofr_2_counter uuid;
    ofr_3        uuid; ofr_4 uuid; ofr_5 uuid;
    -- Last message tracking
    last_msg     uuid;
BEGIN
    -- ───────── conditions ─────────
    INSERT INTO cat_conditions (slug, name, sort_order)
    VALUES ('new',      '{"en":"New","ar":"جديد"}'::jsonb,        1) RETURNING id INTO cnd_new;
    INSERT INTO cat_conditions (slug, name, sort_order)
    VALUES ('like-new', '{"en":"Like New","ar":"كالجديد"}'::jsonb, 2) RETURNING id INTO cnd_likenew;
    INSERT INTO cat_conditions (slug, name, sort_order)
    VALUES ('good',     '{"en":"Good","ar":"جيد"}'::jsonb,         3) RETURNING id INTO cnd_good;
    INSERT INTO cat_conditions (slug, name, sort_order)
    VALUES ('fair',     '{"en":"Fair","ar":"مقبول"}'::jsonb,       4) RETURNING id INTO cnd_fair;

    -- ───────── categories ─────────
    INSERT INTO cat_categories (slug, name, sort_order)
    VALUES ('furniture',   '{"en":"Furniture","ar":"أثاث"}'::jsonb,         1) RETURNING id INTO cat_furn;
    INSERT INTO cat_categories (slug, name, sort_order)
    VALUES ('electronics', '{"en":"Electronics","ar":"إلكترونيات"}'::jsonb, 2) RETURNING id INTO cat_elec;
    INSERT INTO cat_categories (slug, name, sort_order)
    VALUES ('fashion',     '{"en":"Fashion","ar":"أزياء"}'::jsonb,          3) RETURNING id INTO cat_fash;
    INSERT INTO cat_categories (slug, name, sort_order)
    VALUES ('home',        '{"en":"Home","ar":"منزل"}'::jsonb,              4) RETURNING id INTO cat_home;
    INSERT INTO cat_categories (slug, name, sort_order)
    VALUES ('sports',      '{"en":"Sports","ar":"رياضة"}'::jsonb,           5) RETURNING id INTO cat_sport;
    INSERT INTO cat_categories (slug, name, sort_order)
    VALUES ('other',       '{"en":"Other","ar":"أخرى"}'::jsonb,            99) RETURNING id INTO cat_other;

    -- ───────── neighborhoods ─────────
    INSERT INTO loc_neighborhoods (slug, name, center_lat, center_lng, sort_order)
    VALUES ('dubai-marina', '{"en":"Dubai Marina","ar":"دبي مارينا"}'::jsonb,         25.080, 55.140, 1) RETURNING id INTO n_marina;
    INSERT INTO loc_neighborhoods (slug, name, center_lat, center_lng, sort_order)
    VALUES ('downtown',     '{"en":"Downtown","ar":"وسط المدينة"}'::jsonb,            25.197, 55.274, 2) RETURNING id INTO n_dt;
    INSERT INTO loc_neighborhoods (slug, name, center_lat, center_lng, sort_order)
    VALUES ('jbr',          '{"en":"JBR","ar":"جي بي آر"}'::jsonb,                    25.080, 55.135, 3) RETURNING id INTO n_jbr;
    INSERT INTO loc_neighborhoods (slug, name, center_lat, center_lng, sort_order)
    VALUES ('jlt',          '{"en":"JLT","ar":"أبراج بحيرات الجميرا"}'::jsonb,        25.069, 55.139, 4) RETURNING id INTO n_jlt;
    INSERT INTO loc_neighborhoods (slug, name, center_lat, center_lng, sort_order)
    VALUES ('business-bay', '{"en":"Business Bay","ar":"الخليج التجاري"}'::jsonb,     25.187, 55.265, 5) RETURNING id INTO n_bb;
    INSERT INTO loc_neighborhoods (slug, name, center_lat, center_lng, sort_order)
    VALUES ('jumeirah',     '{"en":"Jumeirah","ar":"جميرا"}'::jsonb,                  25.231, 55.262, 6) RETURNING id INTO n_jum;

    -- additional neighborhoods (sort_order > 6 places them below the popular six)
    INSERT INTO loc_neighborhoods (slug, name, center_lat, center_lng, sort_order) VALUES
      ('palm-jumeirah',      '{"en":"Palm Jumeirah","ar":"نخلة جميرا"}'::jsonb,                       25.118, 55.138,  7),
      ('dubai-media-city',   '{"en":"Dubai Media City","ar":"مدينة دبي للإعلام"}'::jsonb,             25.094, 55.156,  8),
      ('internet-city',      '{"en":"Internet City","ar":"مدينة الإنترنت"}'::jsonb,                   25.099, 55.166,  9),
      ('barsha-heights',     '{"en":"Barsha Heights (Tecom)","ar":"برشاء هايتس"}'::jsonb,             25.094, 55.179, 10),
      ('difc',               '{"en":"DIFC","ar":"مركز دبي المالي العالمي"}'::jsonb,                   25.214, 55.279, 11),
      ('sheikh-zayed-road',  '{"en":"Sheikh Zayed Road","ar":"شارع الشيخ زايد"}'::jsonb,              25.220, 55.280, 12),
      ('city-walk',          '{"en":"City Walk","ar":"سيتي ووك"}'::jsonb,                             25.205, 55.265, 13),
      ('umm-suqeim',         '{"en":"Umm Suqeim","ar":"أم سقيم"}'::jsonb,                             25.144, 55.193, 14),
      ('al-wasl',            '{"en":"Al Wasl","ar":"الوصل"}'::jsonb,                                  25.196, 55.250, 15),
      ('bur-dubai',          '{"en":"Bur Dubai","ar":"بر دبي"}'::jsonb,                               25.260, 55.300, 16),
      ('karama',             '{"en":"Karama","ar":"الكرامة"}'::jsonb,                                 25.245, 55.300, 17),
      ('satwa',              '{"en":"Satwa","ar":"السطوة"}'::jsonb,                                   25.234, 55.281, 18),
      ('oud-metha',          '{"en":"Oud Metha","ar":"عود ميثاء"}'::jsonb,                            25.243, 55.314, 19),
      ('al-jaddaf',          '{"en":"Al Jaddaf","ar":"الجداف"}'::jsonb,                               25.220, 55.330, 20),
      ('deira',              '{"en":"Deira","ar":"ديرة"}'::jsonb,                                     25.273, 55.320, 21),
      ('al-rigga',           '{"en":"Al Rigga","ar":"الرقة"}'::jsonb,                                 25.265, 55.325, 22),
      ('al-mamzar',          '{"en":"Al Mamzar","ar":"الممزر"}'::jsonb,                               25.300, 55.348, 23),
      ('al-qusais',          '{"en":"Al Qusais","ar":"القصيص"}'::jsonb,                               25.290, 55.380, 24),
      ('al-nahda',           '{"en":"Al Nahda","ar":"النهدة"}'::jsonb,                                25.290, 55.370, 25),
      ('dubai-hills-estate', '{"en":"Dubai Hills Estate","ar":"دبي هيلز"}'::jsonb,                    25.105, 55.250, 26),
      ('mbr-city',           '{"en":"MBR City","ar":"مدينة محمد بن راشد"}'::jsonb,                    25.165, 55.310, 27),
      ('meydan',             '{"en":"Meydan","ar":"ميدان"}'::jsonb,                                   25.157, 55.298, 28),
      ('al-quoz',            '{"en":"Al Quoz","ar":"القوز"}'::jsonb,                                  25.155, 55.232, 29),
      ('jvc',                '{"en":"JVC","ar":"الضاحية الدائرية بجميرا"}'::jsonb,                    25.060, 55.213, 30),
      ('jvt',                '{"en":"JVT","ar":"ضاحية المثلث بجميرا"}'::jsonb,                        25.052, 55.198, 31),
      ('al-furjan',          '{"en":"Al Furjan","ar":"الفرجان"}'::jsonb,                              25.030, 55.140, 32),
      ('discovery-gardens',  '{"en":"Discovery Gardens","ar":"ديسكفري جاردنز"}'::jsonb,               25.046, 55.140, 33),
      ('motor-city',         '{"en":"Motor City","ar":"موتور سيتي"}'::jsonb,                          25.046, 55.243, 34),
      ('mirdif',             '{"en":"Mirdif","ar":"مردف"}'::jsonb,                                    25.215, 55.420, 35),
      ('al-warqa',           '{"en":"Al Warqa","ar":"الورقاء"}'::jsonb,                               25.197, 55.405, 36),
      ('international-city', '{"en":"International City","ar":"المدينة العالمية"}'::jsonb,            25.166, 55.408, 37),
      ('festival-city',      '{"en":"Dubai Festival City","ar":"دبي فيستيفال سيتي"}'::jsonb,          25.218, 55.353, 38),
      ('creek-harbour',      '{"en":"Dubai Creek Harbour","ar":"ميناء خور دبي"}'::jsonb,              25.198, 55.347, 39),
      ('dubai-south',        '{"en":"Dubai South","ar":"دبي الجنوب"}'::jsonb,                         24.892, 55.165, 40),
      ('expo-city',          '{"en":"Expo City","ar":"إكسبو سيتي"}'::jsonb,                           24.957, 55.150, 41),
      ('dip',                '{"en":"Dubai Investment Park","ar":"مجمع دبي للاستثمار"}'::jsonb,       24.985, 55.215, 42);

    -- ───────── users ─────────
    INSERT INTO usr_users (auth0_sub, phone, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|aisha', '971501234567', 'Aisha Al Mansouri', 'aisha_m',  'A', 1, 0, 2024, n_marina) RETURNING id INTO u_aisha;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|omar',   'Omar Khalid',       'omar_k',   'O', 0, 0, 2025, n_marina) RETURNING id INTO u_omar;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|priya',  'Priya Desai',       'priya_d',  'P', 1, 0, 2022, n_jlt)    RETURNING id INTO u_priya;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|rami',   'Rami Hassan',       'rami_h',   'R', 1, 0, 2024, n_dt)     RETURNING id INTO u_rami;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|khalid', 'Khalid Al Suwaidi', 'khalid_s', 'K', 1, 0, 2024, n_jum)    RETURNING id INTO u_khalid;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|sara',   'Sara Damiani',      'sara_d',   'S', 0, 1, 2025, n_bb)     RETURNING id INTO u_sara;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|ahmed',  'Ahmed Saleh',       'ahmed_s',  'A', 0, 1, 2025, n_jlt)    RETURNING id INTO u_ahmed;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|layla',  'Layla Rahimi',      'layla_r',  'L', 1, 0, 2024, n_marina) RETURNING id INTO u_layla;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|hassan', 'Hassan Tariq',      'hassan_t', 'H', 0, 1, 2025, n_bb)     RETURNING id INTO u_hassan;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|noura',  'Noura Al Falasi',   'noura_f',  'N', 1, 0, 2024, n_jbr)    RETURNING id INTO u_noura;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|rashid', 'Rashid Al Nuaimi',  'rashid_n', 'R', 1, 0, 2023, n_jum)    RETURNING id INTO u_rashid;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|fatima', 'Fatima Lootah',     'fatima_l', 'F', 1, 0, 2024, n_marina) RETURNING id INTO u_fatima;
    INSERT INTO usr_users (auth0_sub, name, handle, avatar_initial, is_verified, is_new_seller, joined_year, home_neighborhood_id)
    VALUES ('seed|yusuf',  'Yusuf Karam',       'yusuf_k',  'Y', 0, 1, 2025, n_dt)     RETURNING id INTO u_yusuf;

    -- ───────── listings ─────────
    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, previous_price_aed, status, published_at)
    VALUES (u_aisha, cat_furn, cnd_likenew, n_marina,
            '{"original":"Herman Miller Aeron, size B","en":"Herman Miller Aeron, size B","ar":"كرسي هيرمان ميلر إيرون، مقاس B"}'::jsonb,
            '{"original":"Bought 18 months ago. Smoke-free, pet-free home in Marina. Genuine, not a replica.","en":"Bought 18 months ago. Smoke-free, pet-free home in Marina. Genuine, not a replica.","ar":"اشتريته قبل 18 شهرًا. منزل بلا تدخين أو حيوانات أليفة في المارينا. أصلي، ليس مقلدًا."}'::jsonb,
            3200, 4500, 'active', now() - interval '1 day') RETURNING id INTO l_aeron;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_omar, cat_furn, cnd_good, n_dt,
            '{"original":"Leather sofa, 3-seat, dark brown","en":"Leather sofa, 3-seat, dark brown","ar":"أريكة جلدية، 3 مقاعد، بني داكن"}'::jsonb,
            '{"original":"Comfortable 3-seater. Some wear on the armrests but solid frame.","en":"Comfortable 3-seater. Some wear on the armrests but solid frame.","ar":"مريحة لثلاثة أشخاص. بعض التآكل على المساند ولكن الإطار متين."}'::jsonb,
            1800, 'active', now() - interval '3 day') RETURNING id INTO l_sofa;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_priya, cat_elec, cnd_likenew, n_jbr,
            '{"original":"iPhone 15 Pro 256GB Titanium","en":"iPhone 15 Pro 256GB Titanium","ar":"آيفون 15 برو 256 جيجا تيتانيوم"}'::jsonb,
            '{"original":"Excellent condition, full box, charger included. Battery health 96%.","en":"Excellent condition, full box, charger included. Battery health 96%.","ar":"حالة ممتازة، علبة كاملة، شاحن مرفق. صحة البطارية 96٪."}'::jsonb,
            2650, 'active', now() - interval '6 hour') RETURNING id INTO l_iphone;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_aisha, cat_elec, cnd_new, n_bb,
            '{"original":"Dyson Airwrap Complete","en":"Dyson Airwrap Complete","ar":"دايسون إيروراب كامل"}'::jsonb,
            '{"original":"Sealed, unopened gift. All attachments included.","en":"Sealed, unopened gift. All attachments included.","ar":"هدية مغلفة لم تُفتح. جميع الملحقات متضمنة."}'::jsonb,
            1100, 'active', now() - interval '2 day') RETURNING id INTO l_dyson;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, previous_price_aed, status, published_at)
    VALUES (u_omar, cat_sport, cnd_good, n_jlt,
            '{"original":"Brompton folding bike, M6L","en":"Brompton folding bike, M6L","ar":"دراجة قابلة للطي بروميتون M6L"}'::jsonb,
            '{"original":"6-speed, raw lacquer finish. A few scratches from commuting; mechanically perfect.","en":"6-speed, raw lacquer finish. A few scratches from commuting; mechanically perfect.","ar":"6 سرعات، طلاء لاكير. بعض الخدوش من الاستخدام؛ ميكانيكيًا ممتازة."}'::jsonb,
            2900, 3500, 'active', now() - interval '5 day') RETURNING id INTO l_brompton;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_priya, cat_elec, cnd_likenew, n_marina,
            '{"original":"Nintendo Switch OLED + 3 games","en":"Nintendo Switch OLED + 3 games","ar":"نينتندو سويتش OLED + 3 ألعاب"}'::jsonb,
            '{"original":"Includes Mario Kart 8, Animal Crossing, Zelda BOTW. Light use.","en":"Includes Mario Kart 8, Animal Crossing, Zelda BOTW. Light use.","ar":"يشمل ماريو كارت 8، أنيمل كروسينج، زيلدا. استخدام خفيف."}'::jsonb,
            920, 'active', now() - interval '12 hour') RETURNING id INTO l_switch;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, previous_price_aed, status, published_at)
    VALUES (u_aisha, cat_furn, cnd_good, n_jlt,
            '{"original":"IKEA Strandmon armchair, beige","en":"IKEA Strandmon armchair, beige","ar":"كرسي إيكيا شتراندمون، بيج"}'::jsonb,
            '{"original":"Beige weave fabric. Small scratch on the right leg, no rips or stains.","en":"Beige weave fabric. Small scratch on the right leg, no rips or stains.","ar":"قماش منسوج بيج. خدش صغير على الساق اليمنى، لا تمزق أو بقع."}'::jsonb,
            850, 1200, 'active', now() - interval '2 day') RETURNING id INTO l_armchair;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_priya, cat_other, cnd_good, n_jum,
            '{"original":"Bugaboo Fox 3 stroller","en":"Bugaboo Fox 3 stroller","ar":"عربة أطفال بوغابو فوكس 3"}'::jsonb,
            '{"original":"Used for 1 child, all-terrain wheels, includes bassinet.","en":"Used for 1 child, all-terrain wheels, includes bassinet.","ar":"استُخدمت لطفل واحد، عجلات لكل التضاريس، تشمل سرير المهد."}'::jsonb,
            450, 'active', now() - interval '7 day') RETURNING id INTO l_stroller;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_omar, cat_sport, cnd_likenew, n_dt,
            '{"original":"Wilson Pro Staff 97 v14 racket","en":"Wilson Pro Staff 97 v14 racket","ar":"مضرب ويلسون برو ستاف 97 v14"}'::jsonb,
            '{"original":"Strung once, in mint condition. Grip 3.","en":"Strung once, in mint condition. Grip 3.","ar":"مشدود مرة واحدة، حالة ممتازة. مقبض 3."}'::jsonb,
            280, 'active', now() - interval '4 day') RETURNING id INTO l_tennis;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_aisha, cat_fash, cnd_new, n_marina,
            '{"original":"Dior Lady D-Lite, medium, navy","en":"Dior Lady D-Lite, medium, navy","ar":"حقيبة ديور ليدي دي-لايت، متوسطة، كحلي"}'::jsonb,
            '{"original":"Brand new with tags, dust bag, authenticity card. Bought from Dubai Mall.","en":"Brand new with tags, dust bag, authenticity card. Bought from Dubai Mall.","ar":"جديدة مع البطاقات وكيس الغبار وبطاقة الأصالة. اشتُريت من دبي مول."}'::jsonb,
            4200, 'active', now() - interval '3 hour') RETURNING id INTO l_dior;

    -- ───────── new listings (no photos yet) ─────────
    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_rami, cat_furn, cnd_likenew, n_dt,
            '{"original":"West Elm velvet armchair, teal","en":"West Elm velvet armchair, teal","ar":"كرسي ويست إلم مخملي، تركوازي"}'::jsonb,
            '{"original":"Like new, used 6 months. Vibrant teal velvet, no stains.","en":"Like new, used 6 months. Vibrant teal velvet, no stains.","ar":"كالجديد، استُخدم 6 أشهر. مخمل تركوازي زاهي، بلا بقع."}'::jsonb,
            1400, 'active', now() - interval '6 hour') RETURNING id INTO l_velvet;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, previous_price_aed, status, published_at)
    VALUES (u_khalid, cat_furn, cnd_good, n_jum,
            '{"original":"Mid-century modern lounge chair","en":"Mid-century modern lounge chair","ar":"كرسي صالة بطراز منتصف القرن"}'::jsonb,
            '{"original":"Walnut frame, leather upholstery. Some patina, very comfortable.","en":"Walnut frame, leather upholstery. Some patina, very comfortable.","ar":"إطار جوز، تنجيد جلد. بعض الباتينا، مريح جدًا."}'::jsonb,
            2100, 2600, 'active', now() - interval '3 day') RETURNING id INTO l_lounge;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_sara, cat_furn, cnd_likenew, n_jlt,
            '{"original":"Muji oak dining chair × 4","en":"Muji oak dining chair × 4","ar":"كرسي طعام موجي خشب البلوط × 4"}'::jsonb,
            '{"original":"Set of 4 solid oak chairs. Used in dining room, no damage.","en":"Set of 4 solid oak chairs. Used in dining room, no damage.","ar":"طقم من 4 كراسي بلوط صلب. استُخدم في غرفة الطعام، بلا أضرار."}'::jsonb,
            1200, 'active', now() - interval '1 day') RETURNING id INTO l_muji;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_ahmed, cat_sport, cnd_likenew, n_marina,
            '{"original":"Canyon Endurace 7 road bike, size M","en":"Canyon Endurace 7 road bike, size M","ar":"دراجة كانيون إندوريس 7، مقاس M"}'::jsonb,
            '{"original":"Aluminum frame, carbon fork. Recently serviced, new chain.","en":"Aluminum frame, carbon fork. Recently serviced, new chain.","ar":"إطار ألمنيوم، شوكة كربون. خُدمت مؤخرًا، سلسلة جديدة."}'::jsonb,
            4200, 'active', now() - interval '4 day') RETURNING id INTO l_canyon;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_layla, cat_elec, cnd_good, n_marina,
            '{"original":"Dyson V11 Animal vacuum","en":"Dyson V11 Animal vacuum","ar":"مكنسة دايسون V11 أنيمال"}'::jsonb,
            '{"original":"Full kit, all attachments. Battery still strong.","en":"Full kit, all attachments. Battery still strong.","ar":"طقم كامل، جميع الملحقات. البطارية لا تزال قوية."}'::jsonb,
            1100, 'active', now() - interval '5 day') RETURNING id INTO l_v11;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_hassan, cat_home, cnd_good, n_bb,
            '{"original":"IKEA Billy bookshelf, white","en":"IKEA Billy bookshelf, white","ar":"رف كتب إيكيا بيلي، أبيض"}'::jsonb,
            '{"original":"80×202cm. Disassembled and ready for pickup.","en":"80×202cm. Disassembled and ready for pickup.","ar":"80×202 سم. مفكك وجاهز للاستلام."}'::jsonb,
            350, 'active', now() - interval '2 day') RETURNING id INTO l_billy;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_noura, cat_home, cnd_likenew, n_jbr,
            '{"original":"De''Longhi Magnifica espresso machine","en":"De''Longhi Magnifica espresso machine","ar":"آلة قهوة ديلونغي ماجنيفيكا"}'::jsonb,
            '{"original":"Fully automatic. Descaled regularly, milk frother works great.","en":"Fully automatic. Descaled regularly, milk frother works great.","ar":"أوتوماتيكية بالكامل. تُنظَّف من الكلس بانتظام، رغوة الحليب ممتازة."}'::jsonb,
            1200, 'active', now() - interval '8 hour') RETURNING id INTO l_espresso;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_rashid, cat_sport, cnd_good, n_jum,
            '{"original":"Callaway golf clubs full set","en":"Callaway golf clubs full set","ar":"طقم مضارب غولف كالاوي كامل"}'::jsonb,
            '{"original":"Driver, 3-wood, irons 4–PW, putter, stand bag. Right-handed, regular flex.","en":"Driver, 3-wood, irons 4–PW, putter, stand bag. Right-handed, regular flex.","ar":"درايفر، 3-وود، حديد 4-PW، باتر، حقيبة. لليد اليمنى، مرونة عادية."}'::jsonb,
            2800, 'active', now() - interval '6 day') RETURNING id INTO l_golf;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_fatima, cat_furn, cnd_good, n_marina,
            '{"original":"Solid pine bunk bed, twin/twin","en":"Solid pine bunk bed, twin/twin","ar":"سرير بطابقين خشب صنوبر صلب"}'::jsonb,
            '{"original":"Includes ladder. Mattresses not included.","en":"Includes ladder. Mattresses not included.","ar":"يشمل سُلَّمًا. الفرشات غير متضمنة."}'::jsonb,
            900, 'active', now() - interval '5 day') RETURNING id INTO l_bunk;

    INSERT INTO lst_listings (seller_id, category_id, condition_id, neighborhood_id, title, description, price_aed, status, published_at)
    VALUES (u_yusuf, cat_elec, cnd_likenew, n_dt,
            '{"original":"DJI Mini 3 Fly More combo","en":"DJI Mini 3 Fly More combo","ar":"درون دي جي آي ميني 3 فلاي مور"}'::jsonb,
            '{"original":"3 batteries, charging hub, ND filters. Under 250g, no permit needed.","en":"3 batteries, charging hub, ND filters. Under 250g, no permit needed.","ar":"3 بطاريات، شاحن، فلاتر ND. أقل من 250 جرامًا، لا حاجة لتصريح."}'::jsonb,
            1800, 'active', now() - interval '7 day') RETURNING id INTO l_drone;

    -- ───────── photos (existing 10 listings only) ─────────
    INSERT INTO lst_listing_photos (listing_id, url, thumb_url, sort_order, width, height) VALUES
        (l_aeron,    'https://picsum.photos/seed/aeron-0/800/800',    'https://picsum.photos/seed/aeron-0/300/300',    0, 800, 800),
        (l_aeron,    'https://picsum.photos/seed/aeron-1/800/800',    'https://picsum.photos/seed/aeron-1/300/300',    1, 800, 800),
        (l_sofa,     'https://picsum.photos/seed/sofa-0/800/800',     'https://picsum.photos/seed/sofa-0/300/300',     0, 800, 800),
        (l_iphone,   'https://picsum.photos/seed/iphone-0/800/800',   'https://picsum.photos/seed/iphone-0/300/300',   0, 800, 800),
        (l_iphone,   'https://picsum.photos/seed/iphone-1/800/800',   'https://picsum.photos/seed/iphone-1/300/300',   1, 800, 800),
        (l_dyson,    'https://picsum.photos/seed/dyson-0/800/800',    'https://picsum.photos/seed/dyson-0/300/300',    0, 800, 800),
        (l_brompton, 'https://picsum.photos/seed/brompton-0/800/800', 'https://picsum.photos/seed/brompton-0/300/300', 0, 800, 800),
        (l_brompton, 'https://picsum.photos/seed/brompton-1/800/800', 'https://picsum.photos/seed/brompton-1/300/300', 1, 800, 800),
        (l_switch,   'https://picsum.photos/seed/switch-0/800/800',   'https://picsum.photos/seed/switch-0/300/300',   0, 800, 800),
        (l_armchair, 'https://picsum.photos/seed/armchair-0/800/800', 'https://picsum.photos/seed/armchair-0/300/300', 0, 800, 800),
        (l_armchair, 'https://picsum.photos/seed/armchair-1/800/800', 'https://picsum.photos/seed/armchair-1/300/300', 1, 800, 800),
        (l_stroller, 'https://picsum.photos/seed/stroller-0/800/800', 'https://picsum.photos/seed/stroller-0/300/300', 0, 800, 800),
        (l_tennis,   'https://picsum.photos/seed/tennis-0/800/800',   'https://picsum.photos/seed/tennis-0/300/300',   0, 800, 800),
        (l_dior,     'https://picsum.photos/seed/dior-0/800/800',     'https://picsum.photos/seed/dior-0/300/300',     0, 800, 800),
        (l_dior,     'https://picsum.photos/seed/dior-1/800/800',     'https://picsum.photos/seed/dior-1/300/300',     1, 800, 800);

    -- ───────── one active boost (Aeron) ─────────
    INSERT INTO bst_boosts (listing_id, user_id, package, duration_hours, starts_at, ends_at, price_aed, source)
    VALUES (l_aeron, u_aisha, 'boost_7d', 168, now() - interval '2 day', now() + interval '5 day', 39, 'wallet');

    -- ───────── conversations + offers + messages ─────────
    -- All conversations involve aisha (the demo "me"). 5 where she sells, 4 where she buys.

    -- ░░░ cnv_1: omar wants aisha's IKEA Strandmon armchair → fresh offer 750 ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_armchair, u_omar, u_aisha, u_omar) RETURNING id INTO cnv_1;

    INSERT INTO ofr_offers (listing_id, conversation_id, buyer_id, seller_id, amount_aed, listed_price_aed, status, expires_at, created_by, created_at)
    VALUES (l_armchair, cnv_1, u_omar, u_aisha, 750, 850, 'new', now() + interval '23 hour', u_omar, now() - interval '8 minute')
    RETURNING id INTO ofr_1;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_1, u_omar,  'text',
            '{"original":"Hi! Is this armchair still available?","en":"Hi! Is this armchair still available?","ar":"Hi! Is this armchair still available?"}'::jsonb,
            u_omar,  now() - interval '16 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_1, u_aisha, 'text',
            '{"original":"Yes, still available — just posted 2 days ago.","en":"Yes, still available — just posted 2 days ago.","ar":"Yes, still available — just posted 2 days ago."}'::jsonb,
            u_aisha, now() - interval '14 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_1, u_omar,  'text',
            '{"original":"Great. Is 750 AED possible? I can pick up today from Marina.","en":"Great. Is 750 AED possible? I can pick up today from Marina.","ar":"Great. Is 750 AED possible? I can pick up today from Marina."}'::jsonb,
            u_omar,  now() - interval '11 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, offer_id, created_by, created_at)
    VALUES (cnv_1, u_omar,  'offer', ofr_1, u_omar, now() - interval '8 minute')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '8 minute', seller_last_read_message_id = NULL WHERE id = cnv_1;

    -- ░░░ cnv_2: priya wants aisha's Dyson Airwrap → text only ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_dyson, u_priya, u_aisha, u_priya) RETURNING id INTO cnv_2;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_2, u_priya, 'text',
            '{"original":"Is the Airwrap still available?","en":"Is the Airwrap still available?","ar":"Is the Airwrap still available?"}'::jsonb,
            u_priya, now() - interval '3 day');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_2, u_aisha, 'text',
            '{"original":"Yes, sealed in box. Never used.","en":"Yes, sealed in box. Never used.","ar":"Yes, sealed in box. Never used."}'::jsonb,
            u_aisha, now() - interval '3 day' + interval '5 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_2, u_priya, 'text',
            '{"original":"Could we meet at JBR this Saturday?","en":"Could we meet at JBR this Saturday?","ar":"Could we meet at JBR this Saturday?"}'::jsonb,
            u_priya, now() - interval '2 day');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_2, u_aisha, 'text',
            '{"original":"Sure, see you 11am at the marina.","en":"Sure, see you 11am at the marina.","ar":"Sure, see you 11am at the marina."}'::jsonb,
            u_aisha, now() - interval '2 day' + interval '15 minute')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '2 day' + interval '15 minute',
                                  buyer_last_read_message_id = last_msg,
                                  seller_last_read_message_id = last_msg WHERE id = cnv_2;

    -- ░░░ cnv_3: ahmed wants aisha's Dior bag → countered offer ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_dior, u_ahmed, u_aisha, u_ahmed) RETURNING id INTO cnv_3;

    -- Original offer from ahmed (now countered)
    INSERT INTO ofr_offers (listing_id, conversation_id, buyer_id, seller_id, amount_aed, listed_price_aed, status, expires_at, created_by, created_at, responded_at)
    VALUES (l_dior, cnv_3, u_ahmed, u_aisha, 3800, 4200, 'countered', now() + interval '20 hour', u_ahmed,
            now() - interval '1 day', now() - interval '20 hour')
    RETURNING id INTO ofr_2_orig;

    -- Aisha's counter (still active)
    INSERT INTO ofr_offers (listing_id, conversation_id, buyer_id, seller_id, amount_aed, listed_price_aed, status, expires_at, counter_of_offer_id, created_by, created_at)
    VALUES (l_dior, cnv_3, u_ahmed, u_aisha, 4000, 4200, 'new', now() + interval '23 hour', ofr_2_orig, u_aisha,
            now() - interval '20 hour')
    RETURNING id INTO ofr_2_counter;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_3, u_ahmed, 'text',
            '{"original":"Hi, interested in the Dior. Authentic right?","en":"Hi, interested in the Dior. Authentic right?","ar":"Hi, interested in the Dior. Authentic right?"}'::jsonb,
            u_ahmed, now() - interval '1 day' - interval '5 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_3, u_aisha, 'text',
            '{"original":"Yes, comes with auth card and dust bag.","en":"Yes, comes with auth card and dust bag.","ar":"Yes, comes with auth card and dust bag."}'::jsonb,
            u_aisha, now() - interval '1 day' - interval '2 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, offer_id, created_by, created_at)
    VALUES (cnv_3, u_ahmed, 'offer', ofr_2_orig, u_ahmed, now() - interval '1 day');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, offer_id, created_by, created_at)
    VALUES (cnv_3, u_aisha, 'offer', ofr_2_counter, u_aisha, now() - interval '20 hour')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '20 hour',
                                  seller_last_read_message_id = last_msg WHERE id = cnv_3;

    -- ░░░ cnv_4: aisha wants rami's velvet armchair → text only ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_velvet, u_aisha, u_rami, u_aisha) RETURNING id INTO cnv_4;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_4, u_aisha, 'text',
            '{"original":"Hi, is the velvet armchair still available?","en":"Hi, is the velvet armchair still available?","ar":"Hi, is the velvet armchair still available?"}'::jsonb,
            u_aisha, now() - interval '4 hour');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_4, u_rami, 'text',
            '{"original":"Yes, still here.","en":"Yes, still here.","ar":"Yes, still here."}'::jsonb,
            u_rami, now() - interval '3 hour' - interval '50 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_4, u_aisha, 'text',
            '{"original":"Color in person — more teal or dark green?","en":"Color in person — more teal or dark green?","ar":"Color in person — more teal or dark green?"}'::jsonb,
            u_aisha, now() - interval '3 hour' - interval '30 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_4, u_rami, 'text',
            '{"original":"True teal, like the photo.","en":"True teal, like the photo.","ar":"True teal, like the photo."}'::jsonb,
            u_rami, now() - interval '3 hour')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '3 hour',
                                  buyer_last_read_message_id = last_msg,
                                  seller_last_read_message_id = last_msg WHERE id = cnv_4;

    -- ░░░ cnv_5: aisha wants ahmed's Canyon bike → accepted offer ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_canyon, u_aisha, u_ahmed, u_aisha) RETURNING id INTO cnv_5;

    INSERT INTO ofr_offers (listing_id, conversation_id, buyer_id, seller_id, amount_aed, listed_price_aed, status, expires_at, created_by, created_at, responded_at)
    VALUES (l_canyon, cnv_5, u_aisha, u_ahmed, 4000, 4200, 'accepted',
            now() + interval '23 hour', u_aisha,
            now() - interval '1 day' - interval '4 hour', now() - interval '1 day')
    RETURNING id INTO ofr_3;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_5, u_aisha, 'text',
            '{"original":"Hi, the Canyon bike still up?","en":"Hi, the Canyon bike still up?","ar":"Hi, the Canyon bike still up?"}'::jsonb,
            u_aisha, now() - interval '2 day');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_5, u_ahmed, 'text',
            '{"original":"Yes, recently serviced. Size M.","en":"Yes, recently serviced. Size M.","ar":"Yes, recently serviced. Size M."}'::jsonb,
            u_ahmed, now() - interval '2 day' + interval '30 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, offer_id, created_by, created_at)
    VALUES (cnv_5, u_aisha, 'offer', ofr_3, u_aisha, now() - interval '1 day' - interval '4 hour');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_5, u_ahmed, 'text',
            '{"original":"Deal! Will accept the offer.","en":"Deal! Will accept the offer.","ar":"Deal! Will accept the offer."}'::jsonb,
            u_ahmed, now() - interval '1 day')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '1 day',
                                  buyer_last_read_message_id = last_msg,
                                  seller_last_read_message_id = last_msg WHERE id = cnv_5;

    -- ░░░ cnv_6: aisha wants layla's Dyson V11 → declined offer ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_v11, u_aisha, u_layla, u_aisha) RETURNING id INTO cnv_6;

    INSERT INTO ofr_offers (listing_id, conversation_id, buyer_id, seller_id, amount_aed, listed_price_aed, status, expires_at, created_by, created_at, responded_at)
    VALUES (l_v11, cnv_6, u_aisha, u_layla, 800, 1100, 'declined',
            now() - interval '3 day' + interval '24 hour', u_aisha,
            now() - interval '4 day', now() - interval '3 day' - interval '12 hour')
    RETURNING id INTO ofr_4;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_6, u_aisha, 'text',
            '{"original":"Hi, is the vacuum still available?","en":"Hi, is the vacuum still available?","ar":"Hi, is the vacuum still available?"}'::jsonb,
            u_aisha, now() - interval '5 day');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_6, u_layla, 'text',
            '{"original":"Yes!","en":"Yes!","ar":"Yes!"}'::jsonb,
            u_layla, now() - interval '5 day' + interval '20 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, offer_id, created_by, created_at)
    VALUES (cnv_6, u_aisha, 'offer', ofr_4, u_aisha, now() - interval '4 day');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_6, u_layla, 'text',
            '{"original":"Sorry, can do 1000 minimum — full kit included.","en":"Sorry, can do 1000 minimum — full kit included.","ar":"Sorry, can do 1000 minimum — full kit included."}'::jsonb,
            u_layla, now() - interval '3 day' - interval '12 hour')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '3 day' - interval '12 hour',
                                  buyer_last_read_message_id = last_msg,
                                  seller_last_read_message_id = last_msg WHERE id = cnv_6;

    -- ░░░ cnv_7: hassan inquiry on aisha's armchair → text only, unread by aisha ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_armchair, u_hassan, u_aisha, u_hassan) RETURNING id INTO cnv_7;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_7, u_hassan, 'text',
            '{"original":"Hi! Saw your armchair in search.","en":"Hi! Saw your armchair in search.","ar":"Hi! Saw your armchair in search."}'::jsonb,
            u_hassan, now() - interval '1 day' - interval '10 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_7, u_hassan, 'text',
            '{"original":"Is this still available?","en":"Is this still available?","ar":"Is this still available?"}'::jsonb,
            u_hassan, now() - interval '1 day')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '1 day' WHERE id = cnv_7;

    -- ░░░ cnv_8: aisha wants noura's espresso machine → text only ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_espresso, u_aisha, u_noura, u_aisha) RETURNING id INTO cnv_8;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_8, u_aisha, 'text',
            '{"original":"Hi, the De''Longhi still up?","en":"Hi, the De''Longhi still up?","ar":"Hi, the De''Longhi still up?"}'::jsonb,
            u_aisha, now() - interval '6 hour');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_8, u_noura, 'text',
            '{"original":"Yes!","en":"Yes!","ar":"Yes!"}'::jsonb,
            u_noura, now() - interval '5 hour' - interval '50 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_8, u_aisha, 'text',
            '{"original":"Does it come with the milk frother?","en":"Does it come with the milk frother?","ar":"Does it come with the milk frother?"}'::jsonb,
            u_aisha, now() - interval '5 hour' - interval '30 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_8, u_noura, 'text',
            '{"original":"Yes, fully automatic.","en":"Yes, fully automatic.","ar":"Yes, fully automatic."}'::jsonb,
            u_noura, now() - interval '5 hour')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '5 hour',
                                  buyer_last_read_message_id = last_msg,
                                  seller_last_read_message_id = last_msg WHERE id = cnv_8;

    -- ░░░ cnv_9: yusuf made a lowball offer on aisha's armchair → expired ░░░
    INSERT INTO msg_conversations (listing_id, buyer_id, seller_id, created_by)
    VALUES (l_armchair, u_yusuf, u_aisha, u_yusuf) RETURNING id INTO cnv_9;

    INSERT INTO ofr_offers (listing_id, conversation_id, buyer_id, seller_id, amount_aed, listed_price_aed, status, expires_at, created_by, created_at)
    VALUES (l_armchair, cnv_9, u_yusuf, u_aisha, 600, 850, 'expired',
            now() - interval '7 day', u_yusuf, now() - interval '8 day')
    RETURNING id INTO ofr_5;

    INSERT INTO msg_messages (conversation_id, sender_id, message_type, text, created_by, created_at)
    VALUES (cnv_9, u_yusuf, 'text',
            '{"original":"Hi, will you take 600?","en":"Hi, will you take 600?","ar":"Hi, will you take 600?"}'::jsonb,
            u_yusuf, now() - interval '8 day' - interval '5 minute');
    INSERT INTO msg_messages (conversation_id, sender_id, message_type, offer_id, created_by, created_at)
    VALUES (cnv_9, u_yusuf, 'offer', ofr_5, u_yusuf, now() - interval '8 day')
    RETURNING id INTO last_msg;
    UPDATE msg_conversations SET last_message_at = now() - interval '8 day',
                                  seller_last_read_message_id = last_msg WHERE id = cnv_9;

    -- ───────── favorites (aisha saves listings she likes) ─────────
    INSERT INTO eng_favorites (user_id, listing_id, created_by) VALUES
        (u_aisha, l_velvet,   u_aisha),
        (u_aisha, l_lounge,   u_aisha),
        (u_aisha, l_canyon,   u_aisha),
        (u_aisha, l_v11,      u_aisha),
        (u_aisha, l_espresso, u_aisha);
END $$;
