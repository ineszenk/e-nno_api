# e-nno_api

# E-nno_api

API URL TEST :  https://enno-api.herokuapp.com

## User testing credentials
   {username:"test",
   password:"123456"}

## Documentation 

https://enno-api.herokuapp.com/api-docs/

## Routes

Authentification to get token
- https://enno-api.herokuapp.com/user/login 

    Request Params: 
    - Username
    - Password

    Response --> Access token

Get data by device (Please make sure to make your api call test with this emulator_serial --> 2019.09.01.002)
- https://enno-api.herokuapp.com/devices/{e-nno_serial}

    Request

    Optional body params*:
        - "startDate"
        - "endDate"
    *Without this params, the call will return all data stored for the device


    Response --> {
        GH : Forward temperature, Backward temperature, Optimisation Value, State.
        Pulse : Conso pulse.
        FTP : Conso coming from SIG.
        Meteo : Ext. Temp and solar radiations.
        Static : Building static datas.
    }



