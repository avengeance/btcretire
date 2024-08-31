import React from "react";
import btcQRCode from "../assets/btcretireqr.png";
import btcregQR from "../assets/btcregular.png";

const Donate: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4 mb-10">
      <h2 className="text-2xl font-bold mb-4">
        Support the Bitcoin Retirement Calculator
      </h2>
      <p className="text-center mb-4">
        If you find this tool useful, consider donating to support its
        development and maintenance.
      </p>
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-center max-w-xs">
          <img
            src={btcQRCode}
            height="300"
            width="300"
            alt="Bitcoin Silent Address QR code"
            title="bitcoin:sp1qqgnrkyeet7yd8a3ucfj0u383tzejxt09csd86jdyjz6ch4lsuyk4jqug75tyz8znsh323vpsm6r4kaul3jn3eky78v3rt5j3q24ygt8595tpss8e"
          />
          <p className="text-sm text-center mt-2">
            Bitcoin Silent Address:
          </p>
          <p className="font-mono text-xs break-all text-center mt-1 px-2">
            sp1qqgnrkyeet7yd8a3ucfj0u383tzejxt09csd86jdyjz6ch4lsuyk4jqug75tyz8znsh323vpsm6r4kaul3jn3eky78v3rt5j3q24ygt8595tpss8e
          </p>
        </div>
        <div className="flex flex-col items-center max-w-xs">
          <img
            src={btcregQR}
            height="300"
            width="300"
            alt="Bitcoin Regular Address QR code"
            title="bitcoin:bc1pm6zlpjs8cnw2d8unkzkxwf2ytzyrcz7zw64phs7kvy2kk60lkqdshq88pp"
          />
          <p className="text-sm text-center mt-2">
            Bitcoin Address:
          </p>
          <p className="font-mono text-xs break-all text-center mt-1 px-2">
            bc1pm6zlpjs8cnw2d8unkzkxwf2ytzyrcz7zw64phs7kvy2kk60lkqdshq88pp
          </p>
        </div>
      </div>
      <p className="mt-8 text-sm text-center">
        Thank you for your support! Your contributions help keep this calculator
        free and up-to-date.
      </p>
    </div>
  );
};

export default Donate;

// import React, { useEffect } from "react";

// declare global {
//   interface Window {
//     btcpay: any;
//   }
// }

// interface ElementWithDataset extends HTMLElement {
//   dataset: DOMStringMap;
// }

// const Donate: React.FC = () => {
//   useEffect(() => {
//     const initializeBTCPay = () => {
//       const handleFormSubmit = (event: Event) => {
//         event.preventDefault();
//         const target = event.target as HTMLFormElement;
//         const xhttp = new XMLHttpRequest();
//         xhttp.onreadystatechange = function () {
//           if (
//             this.readyState === 4 &&
//             this.status === 200 &&
//             this.responseText
//           ) {
//             window.btcpay.appendInvoiceFrame(
//               JSON.parse(this.responseText).invoiceId
//             );
//           }
//         };
//         xhttp.open("POST", target.getAttribute("action")!, true);
//         xhttp.send(new FormData(target));
//       };

//       const forms = document.querySelectorAll<HTMLFormElement>(".btcpay-form");
//       forms.forEach((el) => {
//         if (!(el as ElementWithDataset).dataset.initialized) {
//           el.addEventListener("submit", handleFormSubmit);
//           (el as ElementWithDataset).dataset.initialized = "true";
//         }
//       });

//       const handlePlusMinus = (event: Event) => {
//         event.preventDefault();
//         const target = event.target as HTMLElement;
//         const root = target.closest(".btcpay-form") as HTMLElement;
//         const el = root.querySelector(
//           ".btcpay-input-price"
//         ) as HTMLInputElement;
//         const step =
//           parseInt((target as ElementWithDataset).dataset.step!) || 1;
//         const min = parseInt((target as ElementWithDataset).dataset.min!) || 1;
//         const max = parseInt((target as ElementWithDataset).dataset.max!);
//         const type = (target as ElementWithDataset).dataset.type;
//         const price = parseInt(el.value) || min;
//         if (type === "-") {
//           el.value = (price - step < min ? min : price - step).toString();
//         } else if (type === "+") {
//           el.value = (price + step > max ? max : price + step).toString();
//         }
//       };

//       const plusMinusButtons = document.querySelectorAll(
//         ".btcpay-form .plus-minus"
//       );
//       plusMinusButtons.forEach((el) => {
//         if (!(el as ElementWithDataset).dataset.initialized) {
//           el.addEventListener("click", handlePlusMinus);
//           (el as ElementWithDataset).dataset.initialized = "true";
//         }
//       });

//       const handlePriceInput = (event: Event) => {
//         event.preventDefault();
//         const target = event.target as HTMLInputElement;
//         const root = target.closest(".btcpay-form") as HTMLElement;
//         const price = parseInt((target as ElementWithDataset).dataset.price!);
//         if (isNaN(parseInt(target.value))) {
//           (
//             root.querySelector(".btcpay-input-price") as HTMLInputElement
//           ).value = price.toString();
//         }
//         const min = parseInt(target.getAttribute("min")!) || 1;
//         const max = parseInt(target.getAttribute("max")!);
//         if (parseInt(target.value) < min) {
//           target.value = min.toString();
//         } else if (parseInt(target.value) > max) {
//           target.value = max.toString();
//         }
//       };

//       const priceInputs = document.querySelectorAll(
//         ".btcpay-form .btcpay-input-price"
//       );
//       priceInputs.forEach((el) => {
//         if (!(el as ElementWithDataset).dataset.initialized) {
//           el.addEventListener("input", handlePriceInput);
//           (el as ElementWithDataset).dataset.initialized = "true";
//         }
//       });
//     };

//     if (!window.btcpay) {
//       const script = document.createElement("script");
//       script.src =
//         "https://blftu4qte2libtwpswjrl6rj2gpz4tzfkjr47cwceijd25gnymu5xtad.local/modal/btcpay.js";
//       script.onload = initializeBTCPay;
//       document.getElementsByTagName("head")[0].append(script);
//     } else {
//       initializeBTCPay();
//     }
//   }, []);

//   return (
//     <div className="flex justify-center m-5">
//       {/* <form
//         method="POST"
//         action="https://blftu4qte2libtwpswjrl6rj2gpz4tzfkjr47cwceijd25gnymu5xtad.local/api/v1/invoices"
//         className="btcpay-form btcpay-form--block"
//       >
//         <input
//           type="hidden"
//           name="storeId"
//           value="5V3qWJzcCeUeJLL6pW9ryaeyEpyC4VP8vQcH8ANW8C1o"
//         />
//         <input type="hidden" name="jsonResponse" value="true" />
//         <input
//           type="hidden"
//           name="notifyEmail"
//           value="montecristoholdings@protonmail.com"
//         />
//         <div className="btcpay-custom-container flex justify-center p-5 border">
//           <div className="btcpay-custom text-black">
//             <input
//               className="btcpay-input-price text-black"
//               type="number"
//               name="price"
//               min="1"
//               max="1000000.00"
//               step="1"
//               defaultValue="1"
//               data-price="1"
//               style={{ width: "5em", height: "3em" }}
//             />
//           </div>
//           <select name="currency" className="text-black">
//             <option value="USD" selected>
//               USD
//             </option>
//             <option value="GBP">GBP</option>
//             <option value="EUR">EUR</option>
//             <option value="BTC">BTC</option>
//           </select>
//         </div>
//         <input type="hidden" name="defaultPaymentMethod" value="BTC" />
//         <input
//           type="image"
//           className="submit m-5"
//           name="submit"
//           src="https://blftu4qte2libtwpswjrl6rj2gpz4tzfkjr47cwceijd25gnymu5xtad.local/img/paybutton/pay.svg"
//           style={{ width: "209px" }}
//           alt="Pay with BTCPay Server, a Self-Hosted Bitcoin Payment Processor"
//         />
//       </form> */}

//             <h2 className="text-2xl font-bold mb-4">
//         Support the Bitcoin Retirement Calculator
//       </h2>
//       <p className="text-center mb-4">
//         If you find this tool useful, consider donating to support its
//         development and maintenance.
//       </p>
//       <div className="mb-4">
//         <img
//           src={btcQRCode}
//           height="300"
//           width="300"
//           alt="Bitcoin QR code"
//           title="bitcoin:bc1qn88azanum4f2vdr6nldmnxe9vyp7hhspcudz3a"
//         />
//       </div>
//       <p className="text-sm text-center">
//         Bitcoin Address: <br />
//         <span className="font-mono break-all">
//           bc1qn88azanum4f2vdr6nldmnxe9vyp7hhspcudz3a
//         </span>
//       </p>
//       <p className="mt-4 text-sm text-center">
//         Thank you for your support! Your contributions help keep this calculator
//         free and up-to-date.
//       </p>
//     </div>
//   );
// };

// export default Donate;
