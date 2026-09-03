const { execFileSync } = require('node:child_process');
const path = require('node:path');

// We don't have an Apple Developer certificate, so electron-builder never
// signs the app (CSC_IDENTITY_AUTO_DISCOVERY=false). On Apple Silicon, macOS
// refuses to launch a completely unsigned binary and reports it as "damaged"
// instead of the friendlier "unidentified developer" warning. Ad-hoc signing
// (identity "-") is free, needs no Apple account, and fixes that.
module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') return;

  // For a universal build, electron-builder packs the x64 and arm64 slices
  // into "*-temp" directories, calling afterPack on each, then merges them
  // with @electron/universal and calls afterPack again on the merged app.
  // The merge step requires the two intermediate app bundles to be
  // byte-identical outside their binaries, but signing each one separately
  // gives each a different CodeSignature/CodeResources file and breaks that.
  // So skip the intermediates and only sign the final merged (or single-arch)
  // app.
  if (context.appOutDir.includes('-temp')) return;

  const appPath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`,
  );

  execFileSync(
    'codesign',
    ['--force', '--deep', '--sign', '-', appPath],
    { stdio: 'inherit' },
  );
};
