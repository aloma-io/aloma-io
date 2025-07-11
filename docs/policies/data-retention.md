# Data Retention

How data is retained within home.aloma.io (excluding www.aloma.io).

## Overview

Data is retained in aloma for fulfilling its primary function, administrative and billing aspects as well as legal requirements.
All data deletion happens fully after the backup retention time (see below).

## Company data

Company data (name of the company, billing details, members, ...) are kept until the company is deleted and all obligations have been fullfilled for billing/legal reasons.

## Inbound/Outbound Messages

Whenever aloma receives a task via e.g. a webhook or talks to a connector or a website, an entry (date, connector/url), as well as the content for inbound messages is kept within aloma for 14 days for billing and debugging purposes.

## Workspaces

Workspaces archive tasks with a configurable data retention time. The default is 30 days. 
All task data is then automatically archived.
Other content like steps is deleted when the user deletes a step. 
When a workspace is deleted, all resources/data within that workspace is deleted. The workspace itself is marked as deleted but kept for billing/administrative purposes.
Task data is retained in the archive for 3 years.

## Logs

Logs are kept for 30 days.

## Backups

Backups are kept for 30 days.

## Version

Last update: 2024/01/01 