void setup() {
  Serial.begin(9600); // Inicializa el puerto serie a 9600 baudios
}

void loop() {
  if (Serial.available() > 0) {
    String message = Serial.readStringUntil('\n'); // Lee la línea recibida
    Serial.println("Mensaje recibido: " + message); // Imprime el mensaje recibido
  }
}
