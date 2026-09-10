# Security policy

Please report vulnerabilities privately through GitHub Security Advisories rather than opening a public issue.

## Supported versions

Until the first stable release, security fixes are applied to the latest commit on `main`.

## Untrusted files

`pptcn` currently renders text and native shapes only. Do not pass untrusted image files to the underlying PptxGenJS instance returned by `toPptxGenJS()` without validating file type and size first. PptxGenJS currently depends on `image-size`, whose latest release has known denial-of-service advisories for crafted ICNS, JXL, and HEIF files; this project will update the dependency when an upstream fix is available.
