#!/usr/bin/env Rscript

library(httr)

url <- "http://api.iclikval.riken.jp/annotation"

headers <- add_headers(
  "Accept"        = "application/json",
  "User-Agent"    = "MyApp/1.0",
  "Authorization" = "Bearer your_access_token_here"
)

response <- GET(url, headers)

http_status(response)

content(response, "text")
