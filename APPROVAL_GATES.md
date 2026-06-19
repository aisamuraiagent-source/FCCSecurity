# Approval Gates

## Gate A - Local Read

Allowed for repository inventory and static review.

## Gate B - Mirror Write

Allowed by current implementation request for C:\tmp only.

## Gate C - Source Checkout Write

Blocked by host filesystem and requires renewed human approval after the write-denial root cause is fixed.

## Gate D - External Systems

Requires explicit approval and target details for GitHub, Metabase, network, package install, deploy, CI/CD, credentials, or permissions.

## Gate E - Release

Requires passing validation, resolved or accepted MEDIUM+ findings, sanitized public package, and no OpenAI affiliation/approval overclaim.

