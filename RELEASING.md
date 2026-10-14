# Astronomy Sub Analyser Release Security

This document describes the production release path introduced in version `0.4.20` and the remaining work required for meaningful commercial protection.

## Protection Model

The intended protection has three complementary layers:

1. **Compiled sensitive modules**: move the valuable scoring and classification algorithms from readable renderer JavaScript into compiled native or WebAssembly modules. The current `.wasm` files accelerate full-resolution pixel statistics, but the main scoring logic is still JavaScript and is not yet commercially protected by compilation.
2. **Signed offline licences**: verify an Ed25519-signed licence locally with an embedded public key. The private signing key must exist only in a separate issuer tool or protected release environment and must never be shipped with the application. Licence enforcement is not yet implemented because the product policy still needs to choose portable or machine-bound licences, expiry rules, and offline transfer/reset behaviour.
3. **Platform code signing**: sign release artefacts so macOS and Windows can verify the publisher and detect post-signing modification. Code signing establishes integrity and publisher identity; it does not make source code secret.

## Electron Hardening In v0.4.20

Packaged production builds:

- disable Developer Tools and remove the normal Developer Tools menu entry;
- block common Developer Tools keyboard shortcuts;
- keep renderer sandboxing and context isolation enabled;
- accept privileged IPC only from the packaged local application page;
- prevent unexpected navigation and new windows;
- validate the packaged ASAR and load application code only from that archive;
- disable Electron's Run-as-Node, `NODE_OPTIONS`, and CLI inspection entry points;
- ship compiled `.wasm` kernels without their `.wat` source files.

Development runs made with `npm start` retain Developer Tools. The ordinary `dist:*` commands remain suitable for local package testing. Public releases should use the strict release commands below.

## Strict Release Commands

Install the pinned development dependencies first:

```sh
npm install
```

Build a signed and notarised macOS release:

```sh
npm run dist:release:mac
```

Build a signed Windows release:

```sh
npm run dist:release:win
```

The strict release configuration has `forceCodeSigning` enabled. A missing or unusable signing identity is therefore a build failure, not an unsigned release that looks finished.

## Signing Credentials

For macOS distribution, use an Apple **Developer ID Application** certificate and notarisation credentials. Keep certificates, private keys, app-specific passwords, and App Store Connect API keys out of this repository. Configure them through the operating-system keychain or protected continuous-integration secrets supported by electron-builder.

For Windows distribution, use an Authenticode code-signing certificate or a supported remote signing service. Keep its private key and password outside the repository. Configure the certificate through protected build-machine or continuous-integration secrets supported by electron-builder.

Linux does not have one universal application-signing equivalent for AppImage. A future release process should publish a detached signature and checksum from a protected release environment.

## Release Verification

On macOS, verify the built application and notarisation ticket before publishing:

```sh
codesign --verify --deep --strict --verbose=2 "Astronomy Sub Analyser.app"
spctl --assess --type execute --verbose=2 "Astronomy Sub Analyser.app"
xcrun stapler validate "Astronomy Sub Analyser.app"
```

On Windows, verify the installer in PowerShell:

```powershell
Get-AuthenticodeSignature ".\Astronomy Sub Analyser Setup.exe" | Format-List
```

Also install and launch each final artefact on a clean machine, confirm that analysis remains fully offline, and confirm that Developer Tools cannot be opened in the packaged application.

## Remaining Commercial-Protection Work

Before selling or licensing the application:

- define whether a licence is portable or bound to a machine;
- define perpetual/subscription expiry, grace, transfer, reset, and clock-tampering behaviour;
- create an offline licence format signed with Ed25519 and embed only its public verification key;
- keep the private issuer and signing key outside every customer package;
- decide which features remain available when a licence is absent or invalid;
- migrate sensitive scoring, cloud/tracking classification, and penalty logic into compiled native/WASM modules;
- add production bundling/minification around the remaining renderer code without breaking generated worker code;
- add third-party notices and automate signature/checksum verification.

No obfuscation can make a locally executed application impossible to reverse-engineer. The objective is to raise the cost substantially, protect the licence signing secret completely, and make modified binaries fail platform and licence integrity checks.
