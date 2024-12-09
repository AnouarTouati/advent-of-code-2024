FROM node
WORKDIR /app
COPY . .
CMD ["tail","-f","/dev/null"]