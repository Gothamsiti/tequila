#!/bin/sh
# mkcert localhost -> https://www.storyblok.com/faq/setup-dev-server-https-proxy
local-ssl-proxy --source 3000 --target 3100 --cert 192.168.3.125.pem --key 192.168.3.125-key.pem &
npm run dev