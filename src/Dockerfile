FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Nginx
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && apt-get update && apt-get install -y \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Copy Nginx configuration file

# Copy application source and Gunicorn configuration
COPY backend /app/backend
COPY gunicorn /app/gunicorn


# Expose necessary ports
EXPOSE 80 5001


# Start Nginx and Gunicorn together
CMD gunicorn --config gunicorn/gunicorn_config.py backend.app:app
