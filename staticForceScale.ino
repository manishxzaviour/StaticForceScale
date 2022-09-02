#include "HX711.h"
#include <FS.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
IPAddress staticIP(192, 168, 0, 156);
IPAddress subnet(255, 255, 0, 0);
IPAddress gateway(192, 168, 0, 3);
IPAddress primaryDNS(8, 8, 8, 8);
String ssid=" ";
String password=" ";
const char *ssid_ap = "Static_Scale";
const int LOADCELL_DOUT_PIN = 14;
const int LOADCELL_SCK_PIN = 12;
const int btn = 0;
const int led = LED_BUILTIN;
int calib1 = 1;
int calib2 = 1;
long data[20] = {};
HX711 scale;
int count = 0;
ESP8266WebServer server(80);
void Blink()
{
  digitalWrite(led, LOW);
  delay(500);
  digitalWrite(led, HIGH);
  delay(500);
}
void wifiAp()
{
  WiFi.mode(WIFI_STA);
  int count = 0;
  WiFi.config(staticIP, gateway, subnet, primaryDNS);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println(ssid);
    Serial.println(password);
    Blink();
    count++;
    if (count > 5)
      break;
  }
  if(WiFi.status() != WL_CONNECTED){
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(staticIP, gateway, subnet);
  WiFi.softAP(ssid_ap);
  Serial.println("AP_mode:");
  Serial.println(WiFi.softAPIP());
  Blink();
  }
  Serial.println(WiFi.localIP());
  Blink();
}
void ota()
{
  ArduinoOTA.setHostname("Scale");
  ArduinoOTA.onStart([]()
                     {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else { // U_FS
      type = "filesystem";
    }
	SPIFFS.end();
    Serial.println("Start updating " + type); });
  ArduinoOTA.onEnd([]()
                   {
    Serial.println("\nEnd");
	ESP.restart(); });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total)
                        { Serial.printf("Progress: %u%%\r", (progress / (total / 100))); });
  ArduinoOTA.onError([](ota_error_t error)
                     {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) {
      Serial.println("Auth Failed");
    } else if (error == OTA_BEGIN_ERROR) {
      Serial.println("Begin Failed");
    } else if (error == OTA_CONNECT_ERROR) {
      Serial.println("Connect Failed");
    } else if (error == OTA_RECEIVE_ERROR) {
      Serial.println("Receive Failed");
    } else if (error == OTA_END_ERROR) {
      Serial.println("End Failed");
    } });
  ArduinoOTA.begin();
}
void hNF()
{
  server.send(404, "text/plain", "404 : FnF");
}
void rFile(char *f, int a)
{
  File file = SPIFFS.open(f, "r");
  if (file)
  {
    String s;
    while (file.available())
    {
      s += char(file.read());
    }
    switch (a)
    {
    case 0:
      server.send(200, "text/html", s);
      break;
    case 1:
      server.send(200, "text/css", s);
      break;
    case 2:
      server.send(200, "text/javascript", s);
      break;
      file.close();
    }
    }
    else
    {
      server.send(404, "text/html", "Error: File does not exist");
    }
}
void Index()
{
  rFile("/index.html", 0);
}
void abt()
{
  rFile("/about.html", 0);
}
void style()
{
  rFile("/style.css", 1);
}
void IndexJs()
{
  rFile("/index.js" , 2);
}
void PlotJs()
{
  rFile("/plot.js" , 2);
}
void handleGet() {
  String temp;
  for(int i=0;i<20;i++)
  temp+=String(data[i])+",";
  server.send(200,"text/plain",temp);
}
void zero(){
  scale.tare();
  Serial.println("zero");
  server.send(200,"text/plain"," ");
}
void calib(){
  calib1=0;
  scale.set_scale();
  for(int i=0;i<3;i++){
  calib1+=scale.get_units(80);
  delay(1000);
  }
  calib1/=3;
  calib2=String(server.arg("plain")).toInt();
  scale.set_scale(calib1/calib2);
  server.send(200,"text/plain"," ");
}
void handleRequest()
{
  server.begin();
  server.on("/", Index);
  server.on("/abt", abt);
  server.on("/css", style);
  server.on("/index.js", IndexJs);
  server.on("/plot.js", PlotJs);
  server.on("/get", handleGet);
  server.on("/zero",zero);
  server.on("/calib",calib);
  server.onNotFound(hNF);
}
void setup()
{
  for (int i = 0; i < 20; i++)
  {
    data[i] = 0;
  }
  pinMode(led, OUTPUT);
  Serial.begin(115200);
  delay(3000);
  pinMode(btn, INPUT_PULLUP);
  SPIFFS.begin();
  File file = SPIFFS.open("/const.txt", "r");
  String s;
  while (file.available())
  {
    s += char(file.read());
  }
  file.close();
  ssid = s.substring(s.indexOf("ssid//") + 6, s.indexOf("//pwd"));
  password = s.substring(s.indexOf("//pwd//") + 7, s.indexOf("//calib1"));
  calib1 = s.substring(s.indexOf("//calib1//") + 10, s.indexOf("//calib2")).toInt();
  calib2 = s.substring(s.indexOf("//calib2//") + 10, s.indexOf("//end")).toInt();
  wifiAp();
  ota();
  MDNS.begin("Scale");
	MDNS.addService("http","tcp", 80);
  handleRequest();
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.tare();
  scale.set_scale(calib1 / calib2);
  }
void loop()
{
  if (scale.is_ready())
  {
    long reading = scale.read();
    long val = scale.get_units(4);
    data[count] = val;
    count++;
    if (count == 20)
      count = 0;
    // Serial.print("reading: ");
    // Serial.print(reading);
    // Serial.print(", unit: ");
    // Serial.print(val);
    // Serial.println(" ");
  }
  else
  {
    ("HX711 not found.");
  }
  delay(50);
  server.handleClient();
  MDNS.update();
  ArduinoOTA.handle();
  String temp="";
}