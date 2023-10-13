// PrinterUtils.js

import { DateTime } from "luxon";

const STATUS_CONNECTED = "Connected";
const printerPort = 8008;

const maintainConnection = (ePosDev, ipAddress, setConnectionStatus) => {
  // Set up a setInterval to check the connection status every N milliseconds (adjust the interval as needed)
  const connectionCheckInterval = setInterval(() => {
    const connected =  ePosDev.isConnected();
    if (!ePosDev.isConnected()) {
      // If the connection is lost, attempt to reconnect here
      setConnectionStatus("Reconnecting ...");
      connect(ePosDev, ipAddress, setConnectionStatus, callback_connect);
    }
  }, 9000);

  // Optionally, you can also include a one-time check when this function is first called
  // if (!ePosDev.isConnected()) {
  //   setConnectionStatus("Reconnecting ...");
  //   connect(ePosDev, ipAddress, setConnectionStatus, callback_connect);
  // }
};

const connect = async (ePosDev, ipAddress, setConnectionStatus, callback_connect) => {
  setConnectionStatus("Connecting ...");
  if (!ipAddress) {
    setConnectionStatus("Type the printer IP address");
    return;
  }
  setConnectionStatus("Connecting ...");
  await ePosDev.connect(ipAddress, printerPort, callback_connect);
};

const callback_connect = (ePosDev, setConnectionStatus, callback_createDevice, resultConnect) => {
  const deviceId = 'local_printer';
  const options = { 'crypto': true, 'buffer': false };
  if (resultConnect === 'OK' || resultConnect === 'SSL_CONNECT_OK') {
    setConnectionStatus(STATUS_CONNECTED);
    // Retrieves the Printer object
    ePosDev.createDevice(deviceId, ePosDev.DEVICE_TYPE_PRINTER, options, (deviceObj, errorCode) => {
      if (deviceObj === null) {
        // Displays an error message if the system fails to retrieve the Printer object
        return;
      }
      // Registers the print complete event
      deviceObj.onreceive = (response) => {
        if (response.success) {
          // Displays the successful print message
        } else {
          // Displays error messages
        }
      };
      callback_createDevice(deviceObj);
    });
  } else {
    // Displays error messages
  }
};

const createData = (printer, data) => {
  // console.log(data);

  // Burger Box
  printer.addTextAlign(printer.ALIGN_CENTER);
  printer.addTextSize(3, 3);
  printer.addTextStyle(false, false, true, undefined);
  printer.addText('Burger Box \n \n');

//   // Contact
printer.addTextStyle(false, false, false, undefined);
  printer.addTextSize(1, 1)
  if(data.location === 'Seaford'){
    printer.addText('Tel: 01323 899221 \n \n')
  } else if(data.location === "Eastbourne"){
    printer.addText('Tel: ??? \n')
  }

//   // // Delivery
  printer.addTextStyle(false, false, true, undefined)
  printer.addTextSize(2, 2);
  if(data.delivery === true){
    printer.addText("Delivery \n")
  }else{
    printer.addText("Collection \n")
  }

// // Space
printer.addText('\n')

//   // // Due date/time
  printer.addTextStyle(false, false, false, undefined);
  printer.addTextSize(1, 1);
  const dateTime = DateTime.fromISO(data.acceptedAt);
  const newDateTime = dateTime.plus({ minutes: data.time });
  const date = newDateTime.toFormat('yyyy-MM-dd');
const time = newDateTime.toFormat('HH:mm:ss');
  printer.addText(`Due: ${date}  ${time}\n`);

//   // Space
  printer.addText('\n')

//   // // Order Number
  printer.addText(`Order Number: ...${data._id.slice(-3)}\n`)

  printer.addText('\n')
  const orderDateTime = DateTime.fromISO(data.acceptedAt);
  const orderDate = orderDateTime.toFormat('yyyy-MM-dd');
const orderTime = orderDateTime.toFormat('HH:mm:ss');
  printer.addText(`Accepted at:  ${orderDate}  ${orderTime}`)

//   // // Space
  printer.addText('\n')
//   // Order
  printer.addTextAlign(printer.ALIGN_RIGHT)
  printer.addText('GBP \n')
  printer.addTextSize(1, 1)
  data.orders.map((order) =>  {
    return printer.addTextAlign(printer.ALIGN_CENTER),
    printer.addTextSize(1, 2),
    printer.addText(`${order.quantity} X ${order.product.title.toUpperCase()}\n`),

    printer.addTextAlign(printer.ALIGN_RIGHT),
    printer.addTextSize(1, 1),
    printer.addText(`${order.product.price * order.quantity}\n`),
    printer.addTextAlign(printer.ALIGN_CENTER),
  //   // Fries
    !order.fries ? 
    printer.addText('No Fries') 
    : 
    printer.addText('Incl Fries\n') +
    printer.addTextAlign(printer.ALIGN_RIGHT) +
    printer.addText('1.5'),
    //   // space
    printer.addTextAlign(printer.ALIGN_CENTER),
    printer.addText('\n\n'),
  //   // Extras
    !order.extraOptions.length  
      ? printer.addText('No Extras \n\n') 
      : printer.addTextStyle(false, false, true, undefined)+
      printer.addText("Extra Toppings:\n\n")+
      printer.addTextStyle(false, false, false, undefined)+
      order.extraOptions.map((extra) => {
        return printer.addTextAlign(printer.ALIGN_CENTER),
        printer.addText(`${extra.title}\n`),
        printer.addTextAlign(printer.ALIGN_RIGHT),
        printer.addText(`${extra.price}\n`)
      }),
  //     // space
      printer.addTextAlign(printer.ALIGN_CENTER),
      printer.addText('\n'),
  //     // Upgrades
    !order.extraUpgrades.length  
      ? printer.addText('No Upgrades \n\n') 
      : printer.addTextStyle(false, false, true, undefined)+
      printer.addText("Upgrades:\n\n")+
      printer.addTextStyle(false, false, false, undefined)+
      order.extraUpgrades.map((upgrade) => {
        return printer.addTextAlign(printer.ALIGN_CENTER),
        printer.addText(`${upgrade.title}\n`),
        printer.addTextAlign(printer.ALIGN_RIGHT),
        printer.addText(`${upgrade.price}\n`)
      }),

  //     // Subtotal
      printer.addTextAlign(printer.ALIGN_CENTER),
      printer.addTextStyle(false, false, true, undefined),
      printer.addText('Subtotal\n'),
      printer.addTextAlign(printer.ALIGN_RIGHT),
      printer.addText(`${order.price}\n`),
      printer.addTextStyle(false, false, false, undefined),

  //     // Note
      order.note &&
      printer.addTextAlign(printer.ALIGN_CENTER)+
      printer.addTextStyle(false, false, true, undefined)+
      printer.addText('Note:\n')+
      printer.addText(`${order.note}\n`)+
      printer.addTextStyle(false, false, false, undefined)
  })
  // // space
  printer.addText('\n'),

  // // Discount
  data.discount > 0 && 
  printer.addTextAlign(printer.ALIGN_CENTER)+
  printer.addText('Discount\n')+
  printer.addTextAlign(printer.ALIGN_RIGHT)+
  printer.addText(`-${data.disocunt}\n`),

  // // Delivery
  printer.addTextAlign(printer.ALIGN_CENTER),
  printer.addText('Delivery:\n'),
  printer.addTextAlign(printer.ALIGN_RIGHT),
  data.deliveryCost === 0 && data.delivery === true ?
  printer.addText('Free\n')
  :
  printer.addText(`${data.deliveryCost}\n`),

  // Refund
  data.refunded > 0 &&
  printer.addTextAlign(printer.ALIGN_CENTER)+
  printer.addText('Refunded:\n')+
  printer.addTextAlign(printer.ALIGN_RIGHT)+
  printer.addText(`-${data.refunded}\n`)


  // // Total
  printer.addTextSize(2, 2),
  printer.addTextAlign(printer.ALIGN_CENTER),
  printer.addText('Total:\n'),
  printer.addTextAlign(printer.ALIGN_RIGHT),
  printer.addText(`${data.total + data.deliveryCost - data.refunded}\n`)

  // // Allergen 

  printer.addTextAlign(printer.ALIGN_CENTER),
  printer.addTextStyle(false, false, true, undefined),
  printer.addTextSize(1, 2),
  printer.addText('For Allergen Information \n please contact restaurant.\n')

  // Space
  printer.addText('\n')

  printer.addTextAlign(printer.ALIGN_LEFT),
// Name
  printer.addTextStyle(false, false, false, undefined),
  printer.addText(`${data.details.name}\n`),
  printer.addText(`${data.details.number}\n`),
  printer.addText(`${data.details.email}\n`),

  // space
  printer.addText('\n'),

  data.delivery &&
  printer.addText(`${data.details.address.street}\n`)+
  printer.addText(`${data.details.address.postcode}\n`)

  // space
  printer.addText('\n')
// Instructions
  printer.addTextSize(1, 1),
  printer.addTextStyle(false, false, true, undefined),
  data.details.address.instructions && 
  printer.addText('Delivery Instructions:\n')+
  printer.addText(`${data.details.address.instructions}`)

  // space
  printer.addText('\n\n')

  // thanks
  printer.addTextSize(2, 2),
  printer.addTextAlign(printer.ALIGN_CENTER),
  printer.addText('Thank you for ordering \n Enjoy your food!\n')

  printer.addFeedLine(2)
  printer.addCut(printer.CUT_FEED)
  printer.send();
};

const send = (printer) => {
  printer.send();
};

export { connect, callback_connect, createData, send, maintainConnection };
