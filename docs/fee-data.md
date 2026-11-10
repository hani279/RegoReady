# Auction-to-Road: fee and rule data

Gathered 10 November 2026. Status column: **Confirmed** = read from the official page today; **Unconfirmed** = secondary source or search snippet only; **Missing** = not found.

## 1. NSW government fees

| Item | Amount | Status | Source |
|---|---|---|---|
| Blue slip (safety and identity check), light vehicle | $82 | Confirmed (effective 1 July 2026) | [Inspection fees](https://www.nsw.gov.au/driving-boating-and-transport/vehicle-registration/fees-concessions-and-forms/vehicle-safety-check-and-inspection-fees) |
| Pink slip (safety check), light vehicle | $52 | Confirmed | same |
| Blue slip, motorcycle / trailer no brakes / trailer with brakes | $51 / $42 / $60 | Confirmed | same |
| Pink slip, motorcycle / trailer no brakes / trailer with brakes | $29 / $27 / $41 | Confirmed | same |
| Written-off vehicle first inspection (VIIU) | $87 booking + $564 inspection = $651 | Confirmed | same |
| High-risk vehicle first inspection (e.g. some interstate vehicles) | $87 booking, no inspection fee | Confirmed | same |
| VIIU no-show or change with under 24 hours' notice | $87 | Confirmed | same |
| Registration fee, all vehicles, per year | $84 | Confirmed (see note 1) | [Registration fees](https://www.nsw.gov.au/driving-boating-and-transport/driving-nsw/vehicle-registration/fees-concessions-and-forms/vehicle-registration-fees) |
| Transfer, within 14 days | $42 | Confirmed | same |
| Transfer, after 14 days | $193 | Confirmed | same |
| Standard number plates (new or replacement) | $58 | Confirmed | same |
| Unregistered vehicle permit | $28 | Confirmed | same |
| Cancellation of registration | $37 | Confirmed | same |
| CTP green slip | Quote-based, varies by vehicle and driver | Missing | Needs the SIRA Green Slip Check or insurer quotes |

### Motor vehicle tax, cars and station wagons, per year

| Tare weight (kg) | Private | Business |
|---|---|---|
| Up to 970 | $278 | $449 |
| 971–1150 | $322 | $510 |
| 1151–1500 | $391 | $615 |
| 1501–2500 | $596 | $924 |
| 2501–2790 | $860 | $1,434 |
| 2791–3050 | $977 | $1,629 |
| 3051–3300 | $1,070 | $1,784 |
| 3301–3560 | $1,164 | $1,941 |
| 3561–3810 | $1,249 | $2,083 + $343 |
| 3811–4060 | $1,343 | $2,239 + $343 |
| 4061–4320 | $1,434 | $2,390 + $343 |
| 4321–4500 | $1,525 | $2,542 + $343 |

Status: Confirmed, same registration fees page. Motorcycles are $87.

**Note 1.** The registration fees page also says fees rise 2.65% from 1 July 2026, and mentions a one-off $100 discount on annual registration for private light vehicles from 1 September 2026 to 31 August 2027. I could not tell from the page whether the listed amounts already include the 1 July rise. Check both on the page before hard-coding.

### Stamp duty (motor vehicle duty)

| Rule | Value | Status | Source |
|---|---|---|---|
| Value up to $44,999 | $3 per $100 | Confirmed | [Revenue NSW](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/motor-vehicle-duty) |
| Passenger vehicle $45,000 or more | $1,350 plus $5 per $100 | Confirmed; whether the $5 applies only to the part over $45,000 is not stated on the page (I believe it does) | same |
| Dutiable value, used vehicle | Sale price or market value, whichever is higher, including GST | Confirmed | same |
| Under-declaring | Interest plus penalty tax of up to 90% of unpaid duty | Confirmed | same |

Cross-check results against the [Revenue NSW calculator](https://www.apps09.revenue.nsw.gov.au/erevenue/calculators/motorsimple.php), including rounding of part-hundreds.

## 2. NSW rules for the pathway engine

| Rule | Detail | Status | Source |
|---|---|---|---|
| Blue slip needed when | Rego expired more than 3 months ago; vehicle from interstate or overseas; no number plates; written off and approved for re-registration; major change such as a new engine; clearing defect notices | Confirmed | [Service NSW blue slip](https://www.service.nsw.gov.au/transaction/get-an-authorised-unregistered-vehicle-inspection-blue-slip) |
| Blue slip validity | 42 days | Confirmed | same |
| Expired more than 3 months | Plates must also be replaced at a Service NSW centre | Confirmed | same |
| Driving unregistered without a permit | Allowed when getting registration: to an inspection station, service centre, repairer, weighbridge or insurer, by the most direct or convenient route. Book the inspection so you can prove the purpose | Confirmed | [When you can drive an unregistered vehicle](https://www.nsw.gov.au/driving-boating-and-transport/vehicle-registration/unregistered-vehicles/when-you-can-drive-an-unregistered-vehicle) |
| Unregistered vehicle permit | One specific journey, most direct route, multi-day trips capped at 28 days; plates must be removed | Confirmed | [Service NSW UVP](https://www.service.nsw.gov.au/transaction/apply-for-an-unregistered-vehicle-permit) |
| UVP and write-offs | Written-off vehicles are not eligible for a UVP | Confirmed | same |
| Is CTP needed for the unregistered trip | Sources disagree | Missing | Ask Transport for NSW |
| Statutory write-off | Not eligible for an Authorisation to Repair, so cannot be re-registered | Confirmed (page last updated 20 December 2022) | [Re-registering a written-off light vehicle](https://www.nsw.gov.au/driving-boating-and-transport/vehicle-registration/written-off-vehicles/re-registering-a-written-off-light-vehicle) |
| Repairable write-off | Only considered if the applicant was the registered operator for more than 28 days before the damage, or it is hail damage only to the same operator, or the vehicle was inherited | Confirmed | same |
| Re-registration steps | Authorisation to Repair before any repairs, then blue slip, then VIIU inspection, then Service NSW | Confirmed | same |
| Interstate write-off | Cannot be registered in NSW unless first re-registered in another jurisdiction | Unconfirmed (search snippet of the Service NSW page) | [Service NSW](https://www.service.nsw.gov.au/transaction/apply-re-register-written-vehicle) |

Consequence for the product: a buyer at auction was not the registered operator, so any NSW written-off light vehicle is effectively "cannot be registered" for them, whether statutory or repairable.

## 3. Auction house buyer fees

| House | Fee | Status | Source |
|---|---|---|---|
| Pickles, standard vehicle under $2,000 | $525 | Confirmed, GST inclusive | [Pickles car fees](https://www.pickles.com.au/fees/car) |
| Pickles, standard vehicle $2,000 and over | $650 + 1.65% of hammer | Confirmed | same |
| Pickles, prestige | 3.75%, minimum $825 | Confirmed | same |
| Pickles, luxury auctions | 5.90%, minimum $1,050 | Confirmed | same |
| Pickles, online classic and collectable | 7.5%, minimum $660 | Confirmed | same |
| Pickles, EV admin fee | $100 | Confirmed | same |
| Pickles, storage | $75 per day uncollected (free period not stated) | Confirmed | same |
| Pickles, late payment | $75 per invoice per day | Confirmed | same |
| Pickles, salvage and damaged vehicles | No schedule on the page | Missing | Ask Pickles |
| Manheim, up to $2,000 | $500 | Unconfirmed (search snippet of the May 2026 PDF; the site blocked direct access) | [Manheim May 2026 schedule](https://www.manheim.com.au/opalcmsassets/manheim/linkreports/Buyer-Auction-Fees-AU-May26.pdf) |
| Manheim, $2,001 and over | $650 + 1.5% of purchase price | Unconfirmed; the research doc said 1.8% | same |
| Manheim, storage | $66 per day per item from the 3rd business day | Unconfirmed | same |
| Manheim, late payment / invoice re-issue | $121 / $33 | Unconfirmed | same |
| Manheim, newer schedule | A schedule effective 1 June 2026 exists and may differ | Missing | [Manheim June 2026 schedule](https://www.manheim.com.au/opalcmsassets/manheim/linkreports/Buyer-Auction-Fees-Jun26.pdf) |
| Lloyds, vehicles | 12.5% buyer's premium, GST inclusive; 0.75% card surcharge | Unconfirmed (search snippets of 2025–2026 listing pages; no rate card) | [Lloyds listing example](https://www.lloydsonline.com.au/AuctionDetails.aspx?aid=73733) |
| Grays | No single rate card; premium is set per sale or lot. Examples seen: 7% on $10,001–$30,000, 6% above, 5% from $40,001 | Unconfirmed | [Grays motor vehicles](https://www.grays.com/search/automotive-trucks-and-marine/motor-vehiclesmotor-cycles?tab=items) |
| Carbids | No published schedule found. It is run by ALLBIDS (Fyshwick ACT) | Missing | [Carbids contact](https://carbids.com.au/Contact) |

## 3a. Private sales (carsales, Facebook Marketplace, Gumtree)

There is no buyer's premium on a private sale. The buyer's costs are government charges plus the checks they choose to pay for.

### Buyer costs

| Item | Amount | Status | Source |
|---|---|---|---|
| Platform fee to the buyer: carsales, Facebook Marketplace, Gumtree | None found | Unconfirmed (no source states it outright; carsales has a "pay through carsales" option whose buyer cost I could not confirm) | [carsales ad cost help](https://help.carsales.com.au/hc/en-gb/articles/34235710344217-How-much-does-an-ad-cost) |
| Transfer fee, within 14 days of acquiring / after | $42 / $193 | Confirmed | [Registration fees](https://www.nsw.gov.au/driving-boating-and-transport/driving-nsw/vehicle-registration/fees-concessions-and-forms/vehicle-registration-fees) |
| Stamp duty | $3 per $100 on the higher of price paid or market value (section 1) | Confirmed | [Revenue NSW](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/motor-vehicle-duty) |
| Pink slip to transfer a currently NSW-registered car | Not required | Confirmed | [Service NSW transfer](https://www.service.nsw.gov.au/transaction/transfer-a-vehicle-registration) |
| Number plate fee | Only if applicable, e.g. not keeping special plates ($58 standard) | Confirmed | same |
| Motor vehicle tax top-up | Only if the seller had a tax concession the buyer is not entitled to | Confirmed | same |
| Unregistered, expired over 3 months, interstate or no plates | Same path as an auction car: blue slip $82, CTP, registration $84, plates $58, vehicle tax by weight, duty | Confirmed | sections 1 and 2 |
| PPSR search | $2 online | Unconfirmed | section 4 |
| Pre-purchase inspection, mobile, Sydney | RedBook Inspect (NRMA partner): Lite from $195, Standard from $295, varies by vehicle; remote video assessment $115 | Unconfirmed (search snippets) | [RedBook Inspect Sydney](https://www.redbookinspect.com.au/prepurchase/pre-purchase-car-inspection-sydney) |
| Pre-purchase inspection, general NSW range | About $125–$350 | Unconfirmed (third-party estimate) | [Auto Hero](https://autohero.com.au/service/car-pre-purchase-inspection/nsw) |
| GST | Not added on a sale by a private individual | My understanding, not sourced | |
| Towing and storage | No auction-yard storage; towing only if the car is unregistered or undrivable | | |

### Transfer rules

| Rule | Detail | Status |
|---|---|---|
| Deadline | Transfer within 14 days of acquiring the vehicle to avoid the late fee | Confirmed |
| Seller's job | Lodge a notice of disposal | Confirmed |
| Online transfer works only if | Vehicle is NSW-registered and the seller has lodged the notice of disposal | Confirmed |
| Must go to a Service NSW centre if | Interstate seller, buying for an organisation, deceased owner, rego expired more than 3 months, not keeping special plates, or claiming a duty exemption | Confirmed |
| In-person documents | Application for Transfer of Registration, proof of identity, certificate of registration signed on the back by the seller (or other proof of entitlement), payment | Confirmed |

Source: [Service NSW, transfer a vehicle registration](https://www.service.nsw.gov.au/transaction/transfer-a-vehicle-registration).

### Buyer protection (drives the "risk" side of the report)

| Channel | Protection | Status |
|---|---|---|
| Private sale | Not covered by the Motor Dealers and Repairers Act or Australian Consumer Law; no cooling-off; Fair Trading cannot help with disputes; buyer must check for money owing themselves | Confirmed via search snippet of [Fair Trading NSW](https://www.fairtrading.nsw.gov.au/cars-and-other-vehicles/buying-and-selling-a-car/buying-a-used-car) |
| Auction | No dealer guarantee and no cooling-off | same |
| Licensed dealer | Guarantees no money owing; dealer guarantee of up to 3 months or 5,000 km on eligible cars (under 10 years old or under 160,000 km: check the exact test); cooling-off until 5pm next business day on dealer-financed sales only | same; guarantee terms appear in more than one version |

### Seller-side platform fees (for the later "sell mode", not a buyer cost)

| Platform | Fee | Status |
|---|---|---|
| carsales | One-off upfront ad fee, no commission; price is set by demand and not published. One user report of $215 for a standard ad under $40k | Unconfirmed |
| Facebook Marketplace | Free to list | Unconfirmed (most recent primary source is a 2020 Facebook submission to the ACCC) |
| Gumtree | Not found | Missing |

## 4. Data costs

| Item | Amount | Status |
|---|---|---|
| Official PPSR vehicle search | $2 online | Unconfirmed (ppsr.gov.au was unavailable; secondary sources only) |
| BusinessAPI PPSR search, plate-to-VIN lookups | $6.00 and $0.30 | Unconfirmed (from the research doc, not rechecked) |

## 5. Still to get

1. Manheim's current buyer fee schedule: open the June 2026 PDF in a browser.
2. Carbids and Grays fees: read the terms on a live listing, or email them.
3. Pickles salvage fees and the length of the free storage period.
4. CTP: decide between linking out to the SIRA Green Slip Check and asking the user for a quote.
5. Whether the registration fee table already includes the 1 July 2026 rise, and the $100 discount.
6. The official PPSR search fee, and the interstate write-off wording on the Service NSW page.
7. Private sales: whether "pay through carsales" costs the buyer anything, current pre-purchase inspection prices, and Gumtree's fees.
