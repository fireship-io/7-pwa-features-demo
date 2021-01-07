const button = document.getElementById('ble');
button.addEventListener('click', (event) => connectBluetooth());

async function connectBluetooth() {

    // Connect Device
    const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] });
    const server = await device.gatt.connect();

    // Get heart rate data
    const hr = await server.getPrimaryService('heart_rate');
    const hrMeasurement = await hr.getCharacteristic('heart_rate_measurement');

    // Listen to changes on device
    await hrMeasurement.startNotifications(); 

    hrMeasurement.addEventListener('characteristicvaluechanged', (e) => {
        console.log(parseHeartRate(e.target.value));
    });

}

function parseHeartRate(value) {
    // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
    value = value.buffer ? value : new DataView(value);
    let flags = value.getUint8(0);
    let rate16Bits = flags & 0x1;
    let result = {};
    let index = 1;
    if (rate16Bits) {
        result.heartRate = value.getUint16(index, /*littleEndian=*/true);
        index += 2;
    } else {
        result.heartRate = value.getUint8(index);
        index += 1;
    }
    let contactDetected = flags & 0x2;
    let contactSensorPresent = flags & 0x4;
    if (contactSensorPresent) {
        result.contactDetected = !!contactDetected;
    }
    let energyPresent = flags & 0x8;
    if (energyPresent) {
        result.energyExpended = value.getUint16(index, /*littleEndian=*/true);
        index += 2;
    }
    let rrIntervalPresent = flags & 0x10;
    if (rrIntervalPresent) {
        let rrIntervals = [];
        for (; index + 1 < value.byteLength; index += 2) {
            rrIntervals.push(value.getUint16(index, /*littleEndian=*/true));
        }
        result.rrIntervals = rrIntervals;
    }
    return result;
}
