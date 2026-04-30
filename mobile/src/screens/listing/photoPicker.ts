import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import type { LocalPhoto } from '../../api/types';

const LONG_EDGE_CAP = 2048;

function isHeic(mime?: string | null): boolean {
  if (!mime) return false;
  const m = mime.toLowerCase();
  return m === 'image/heic' || m === 'image/heif';
}

async function processAsset(asset: ImagePicker.ImagePickerAsset): Promise<LocalPhoto> {
  const longest = Math.max(asset.width, asset.height);
  const tooBig = longest > LONG_EDGE_CAP;
  const heic = isHeic(asset.mimeType);
  if (!tooBig && !heic) {
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      mime: asset.mimeType ?? 'image/jpeg',
    };
  }
  const actions: ImageManipulator.Action[] = [];
  if (tooBig) {
    actions.push({
      resize: asset.width >= asset.height
        ? { width: LONG_EDGE_CAP }
        : { height: LONG_EDGE_CAP },
    });
  }
  const result = await ImageManipulator.manipulateAsync(asset.uri, actions, {
    compress: 0.85,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return { uri: result.uri, width: result.width, height: result.height, mime: 'image/jpeg' };
}

export async function pickPhotoFromLibrary(): Promise<LocalPhoto | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images' });
  if (result.canceled || result.assets.length === 0) return null;
  return processAsset(result.assets[0]);
}

export async function pickPhotosFromLibrary(selectionLimit: number): Promise<LocalPhoto[]> {
  if (selectionLimit <= 0) return [];
  if (selectionLimit === 1) {
    const p = await pickPhotoFromLibrary();
    return p ? [p] : [];
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsMultipleSelection: true,
    selectionLimit,
  });
  if (result.canceled || result.assets.length === 0) return [];
  return Promise.all(result.assets.map(processAsset));
}
