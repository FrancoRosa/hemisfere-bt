# Hemisfere V500 Bluetooth adapter 

> This script parses Hemisfere v500 binary data

## Requirements
Pair V500 with target PC, then, bind the device to a rfcomm
```bash
sudo rfcomm bind /dev/rfcomm0 XX:XX:XX:XX:XX:XX
```

## Commands
### Atlas Commands

The following tables list the commands accepted by the Atlas-band receiver to configure and monitor the Atlas functionality of the receiver.

| Command               | Description                                                                                      |
|-----------------------|--------------------------------------------------------------------------------------------------|
| `$JI`                 | Requests the serial number and firmware version number from the receiver                         |
| `$JK`                 | Is used to send an authorization code to the receiver                                            |
| `$JK,SHOW`            | Requests the subscription and activation information from the receiver                           |
| `$JASC,GPGGA,1`       | Requests receiver to output GGA positions at 1Hz.                                                 |
| `$JASC,RD1,1`         | Enables Atlas Diagnostic message output                                                           |
| `$JDIFF,LBAND,SAVE`   | Enables Atlas mode for tracking the Atlas communication satellites                               |
| `$JDIFF,INCLUDE,ATLAS`| Enables the Atlas solution in the receiver                                                        |
| `$JFREQ,AUTO`         | Automatically sets the Atlas parameters to track the Atlas communication satellites               |
| `$JATLAS,LIMIT`       | Configure the accuracy threshold for when the NMEA 0183 GPGGA message reports a quality indicator of 4. See `$JATLAS,LIMIT` section for more detail |
| `$JSAVE`              | Saves issued commands                                                                             |

### Commands used:

These are the settings done once the communication was stablished
`picocom /dev/rf` or the serial port to connect, then use the folowing commands to set the binary frecuency
```
$JBIN,3,1 #Activates Bin3 at 1Hz
$JBIN,3,5 #Activates Bin3 at 5Hz
$JBIN,3,10 #Activates Bin3 at 10Hz
```
### Add user to dialout
```bash
sudo usermod -aG dialout $USER
```