FROM node:20
COPY package.json tsconfig.json ./
RUN npm i -y
COPY . .
RUN npm run build
EXPOSE 8000
ENV SPOTIFY_ID 162870df4ca34eb59725b84e4feb3c90
ENV SPOTIFY_SECRET a15f535ba8004578a933d3353442db7d 
ENV REDIRECT_URI http://localhost:3000/
ENV SPOTIFY_ENDPOINT https://accounts.spotify.com/authorize
ENV WORDNIK_API mliu8i6chtdrrb5xpyf56bsudqxc6e4623i2yg41apsizag4a
CMD ["npx", "tsx", "index.tsx"]