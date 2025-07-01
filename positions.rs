typedef struct
{
0 SUnionMsgHeader m_sHead; // [8]
0 double m_dGPSTimeOfWeek; // GPS tow [8 bytes]
8 unsigned short m_wGPSWeek; // GPS week [2 bytes]
10 unsigned short m_wNumSatsTracked; // SATS Tracked [2 bytes]
12 unsigned short m_wNumSatsUsed; // SATS Used [2 bytes]
14 unsigned char m_byNavMode; // Nav Mode (same as message 1) [1 byte ]
15 unsigned char m_bySpare00; // Spare [1 byte ]

16 double m_dLatitude; // Latitude degrees, -90..90 [8 bytes]
24 double m_dLongitude; // Longitude degrees, -180..180 [8 bytes]
32 float m_fHeight; // (m), Altitude ellipsoid [4 bytes]
36 float m_fSpeed; // Horizontal Speed m/s [4 bytes]
40 float m_fVUp; // Vertical Velocity +up m/s [4 bytes]
44 float m_fCOG; // Course over Ground, degrees [4 bytes]
48 float m_fHeading; // Heading (degrees), Zero unless vector[4 bytes]
52 float m_fPitch; // Pitch (degrees), Zero unless vector [4 bytes]
56 float m_fRoll; // Roll (degrees), Zero unless vector [4 bytes]
60 unsigned short m_wAgeOfDiff; // age of differential, seconds [2 bytes]
 // m_wAttitudeStatus: bit {0-3} = sStatus.eYaw
 // bit {4-7} = sStatus.ePitch
 // bit {8-11} = sStatus.eRoll
 // where sStatus can be 0 = INVALID, 1 = GNSS, 2 = Inertial, 3= Magnetic
62 unsigned short m_wAttitudeStatus; // Attitude Status, Zero unless vector [2 bytes]
64 float m_fStdevHeading; // Yaw stdev, degrees, 0 unless vector [4 bytes]
68 float m_fStdevPitch; // Pitch stdev, degrees, 0 unless vector[4 bytes]
72 float m_fHRMS; // Horizontal RMS [4 bytes]
76 float m_fVRMS; // Vertical RMS [4 bytes]
80 float m_fHDOP; // Horizontal DOP [4 bytes]
84 float m_fVDOP; // Vertical DOP [4 bytes]
 float m_fTDOP; // Time DOP [4 bytes]
 float m_fCovNN; // Covaraince North-North [4 bytes]
 float m_fCovNE; // Covaraince North-East [4 bytes]
 float m_fCovNU; // Covaraince North-Up [4 bytes]
 float m_fCovEE; // Covaraince East-East [4 bytes]
 float m_fCovEU; // Covaraince East-Up [4 bytes]
 float m_fCovUU; // Covaraince Up-Up [4 bytes]
 unsigned short m_wCheckSum; // sum of all bytes of the header and data
 unsigned short m_wCRLF; // Carriage Return Line Feed
} SBinaryMsg3; // length = 8 + 116 + 2 + 2 = 128 (108 = 74 hex)