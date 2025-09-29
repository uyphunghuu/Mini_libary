# Mini_library

Mini_library là ứng dụng quản lý thư viện với **frontend React**, **backend Node.js/Express**, và **MySQL**.  

---

## Yêu cầu

- Docker & Docker Compose
- Git
- Cổng `3000`, `5000`, `3306` chưa bị chiếm

---

## 1️⃣ Clone dự án

git clone https://github.com/<your-username>/Mini_library.git
cd Mini_library

---

## 2️⃣ Build Docker images

### Backend

cd backend
docker build -t mini_library-backend .

### Frontend

cd ../frontend
docker build -t mini_library-frontend .

### Database

docker pull mysql:8.0

---

## 3️⃣ Tạo mạng Docker

docker network create mini_library-network

---

## 4️⃣ Chạy container

### MySQL

docker run -d --name mini_library-db --network mini_library-network \
  -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=mini_library \
  -p 3306:3306 mysql:8.0

### Backend

cd ../backend
docker run -d --name mini_library-backend --network mini_library-network \
  -p 5000:5000 \
  -e DB_HOST=mini_library-db -e DB_USER=root -e DB_PASSWORD=root -e DB_NAME=mini_library \
  mini_library-backend

### Frontend

cd ../frontend
docker run -d --name mini_library-frontend --network mini_library-network \
  -p 3000:3000 mini_library-frontend

---

## 5️⃣ Kiểm tra

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000/api  
- Kiểm tra container: docker ps

---

## 6️⃣ Dừng & Xóa container

docker stop mini_library-frontend mini_library-backend mini_library-db
docker rm mini_library-frontend mini_library-backend mini_library-db
docker network rm mini_library-network

---

> Thay `<your-username>` bằng tên GitHub của bạn.
