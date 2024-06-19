#include <SoftwareSerial.h>
SoftwareSerial mySerial(10, 11); // RX, TX
const int ledPin = 8;
boolean bluetoothConnected = false;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  while (!Serial) {
    ; 
  }

  mySerial.begin(38400); 
  Serial.println("Iniciando prueba del módulo Bluetooth");
}

void loop() {
  if (mySerial.available()) {
    char dataFromBT = mySerial.read();
    Serial.write(dataFromBT);
    
    if (dataFromBT == '1') {
      digitalWrite(ledPin, HIGH); // Enciende el LED
      Serial.println("LED encendido");
    } else if (dataFromBT == '0') {
      digitalWrite(ledPin, LOW); // Apaga el LED
      Serial.println("LED apagado");
    }
    
    // Verifica si se ha recibido una respuesta adecuada del módulo Bluetooth para confirmar la conexión
    if (!bluetoothConnected && dataFromBT == 'O' && mySerial.available() > 1 && mySerial.read() == 'K') {
      bluetoothConnected = true;
      Serial.println("Conexión establecida con el módulo Bluetooth");
    }
  }

  if (Serial.available()) {
    mySerial.write(Serial.read());
  }
}
