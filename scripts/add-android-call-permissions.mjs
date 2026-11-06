import { readFileSync, writeFileSync } from 'node:fs';

const manifestPath = 'android/app/src/main/AndroidManifest.xml';
let manifest = readFileSync(manifestPath, 'utf8');
const permissions = [
  'android.permission.INTERNET',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.MODIFY_AUDIO_SETTINGS'
];

for (const permission of permissions) {
  const declaration = `    <uses-permission android:name="${permission}" />`;
  if (!manifest.includes(`android:name="${permission}"`)) {
    manifest = manifest.replace('<application', `${declaration}\n    <application`);
  }
}

writeFileSync(manifestPath, manifest);
console.log('Android camera, microphone, internet and audio permissions are configured.');
