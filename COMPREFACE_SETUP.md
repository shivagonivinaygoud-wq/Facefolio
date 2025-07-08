
# CompreFace Setup Guide

## 1. Start CompreFace with Docker

Run the following command in your project root:

```bash
docker-compose up -d
```

This will start CompreFace services:
- Admin UI: http://localhost:8080
- API: http://localhost:8000
- Frontend: http://localhost:8081

## 2. Initial Setup

1. Open http://localhost:8080 in your browser
2. Create an admin account (first time setup)
3. Log in to the admin dashboard

## 3. Create Face Recognition Service

1. In the admin dashboard, click "Create Application"
2. Name it "KwicPic"
3. Click on the created application
4. Click "Create Service"
5. Choose "Face Recognition" service type
6. Name it "face-detection"
7. Copy the API Key and Service URL

## 4. Update Application Configuration

After creating the service, update the configuration in your app with:
- Base URL: http://localhost:8000
- Service API Key: (copy from CompreFace dashboard)
- Service ID: (from the service URL)

## 5. Test the Service

You can test face detection by uploading a photo through the CompreFace UI or using the API directly.

## 6. Stop CompreFace

To stop all services:
```bash
docker-compose down
```

To stop and remove volumes:
```bash
docker-compose down -v
```
