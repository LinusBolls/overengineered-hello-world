# abfahrt

a library for retrieving information about micromobility services like MILES Mobility GmbH with focus on the Berlin area.

```bash
$ npm install abfahrt
```

## MILES examples

```ts
// make requests without an account
import { MilesClient, polygonToArea } from "abfahrt";

async function main() {
  const miles = new MilesClient();

  const areasResponse = await miles.getCityAreas();

  const berlin = areasResponse.JSONCityAreas.areas.find(
    (i) => i.idCity === "BER" && i.idCityLayerType === "CITY_SERVICE_AREA"
  )!;

  const berlinArea = polygonToArea(berlin);

  const vehiclesResponses = await miles
    .createVehicleSearch(berlinArea)
    .execute();

  console.log(
    "amount of miles vehicles in berlin that are currently rentable:",
    vehiclesResponses.length
  );
}
main();
```

```ts
// make requests with an account

import { MilesClient } from "abfahrt";

async function main() {
  const miles = new MilesClient();

  // WARNING: this will sign you out of your MILES account on your phone.
  await miles.loginWithCredentials"example@example.com", "yourMilesPassword");

  const vehiclePricesRes = await miles.getVehiclePrices("S");

  console.log("current vehicle prices:", vehiclePricesRes.length);

  // no reason you would do this lol
  await miles.logout();
}
main();
```

## MILES device keys

every request to the MILES api requires a `deviceKey` parameter.
a random device key will result in unpredictable, incorrect query results.

### methods to retrieve a device key

#### copying from network traffic

1. install the MILES app on an android device or virtual machine
2. root the device and install a ssl certificate to be able to read the traffic
3. use a package sniffer (e.g. [HTTP Toolkit](https://httptoolkit.com), [Wireshark](https://www.wireshark.org)) to intercept HTTP requests
4. copy the device key from a request body
