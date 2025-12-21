FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy your public folder contents into nginx root
COPY public/ /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]