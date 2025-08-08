# 1. Usar Node como base
FROM node:18

# 2. Carpeta de trabajo en el contenedor
WORKDIR /app

# 3. Copiar package.json y package-lock.json
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install --production

# 5. Copiar el resto del código
COPY . .

# 6. Compilar NestJS
RUN npm run build

# 7. Exponer el puerto (igual que en main.ts)
EXPOSE 3000

# 8. Comando para iniciar en modo producción
CMD ["npm", "run", "start:prod"]