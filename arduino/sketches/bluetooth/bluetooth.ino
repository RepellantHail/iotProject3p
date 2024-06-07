// Define the pin number where the LED is connected
const int ledPin = 8;

void setup()
{
    // Set the LED pin as an output
    pinMode(ledPin, OUTPUT);
}

void loop()
{
    // Turn the LED on
    digitalWrite(ledPin, HIGH);
    // Wait for 1000 milliseconds (1 second)
    delay(2000);
    // Turn the LED off
    digitalWrite(ledPin, LOW);
    // Wait for another 1000 milliseconds
    delay(1000);
}
