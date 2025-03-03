# Use a imagem base do Deno
FROM denoland/deno:latest

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração e código para o contêiner
COPY . .

# Expõe a porta que a aplicação vai usar (ajuste conforme necessário)
EXPOSE 8000

# Comando para rodar a aplicação usando a tarefa definida no deno.json
CMD ["deno", "task", "start"]