FROM node:10
WORKDIR /root/blog
COPY . .
RUN npm install \
  && chmod +x /root/blog/setup.sh
EXPOSE 3000
CMD ["sh", "/root/blog/setup.sh"]