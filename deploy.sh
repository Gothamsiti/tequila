source "$HOME/.nvm/nvm.sh"
nvm use 16.18.1
node -v
npm ci
# Build the project
npm run build

# Serve the project using a process manager (e.g., PM2)
pm2 start ecosystem.config.js --only tquilaDevelopment