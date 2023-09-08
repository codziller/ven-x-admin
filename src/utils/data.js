import countriesToCurrencies from "country-to-currency";
import countries from "@odusanya/african-countries";
import { uniq } from "lodash";

const mostUsedCurrenciesToCountries = {
  USD: "US",
  GBP: "GB",
  NGN: "NG",
};

const getCurrenciesToCountries = () => {
  const currenciesToCountries = [];
  const currencies = [];
  Object.keys(countriesToCurrencies).forEach((country) => {
    const currency = countriesToCurrencies[country];
    if (!currencies.includes(currency)) {
      currenciesToCountries.push({ [currency]: country });
      currencies.push(currency);
    }
  });
  return currenciesToCountries;
};

export const getFiatCurrencies = () => {
  const currenciesToCountries = getCurrenciesToCountries();
  return currenciesToCountries.map((currencyToCountry) => {
    return {
      currency: Object.keys(currencyToCountry)[0],
      country:
        mostUsedCurrenciesToCountries[Object.keys(currencyToCountry)[0]] ||
        Object.values(currencyToCountry)[0],
    };
  });
};

export const getCountryCodeFromCurrency = (currency) => {
  if (!currency) return "";
  const currenciesToCountries = getCurrenciesToCountries();
  const currencyToCheck = currency.toUpperCase();
  const country = currenciesToCountries.find(
    (_) => Object.keys(_)[0] === currencyToCheck
  );
  return (
    mostUsedCurrenciesToCountries?.[currencyToCheck] ||
    country?.[currencyToCheck] ||
    " "
  );
};

export const getAfricanCountryCodes = () => {
  const africanCountries = countries.listCountries();
  const codes = [];
  africanCountries.forEach((africanCountry) => {
    codes.push(africanCountry.Code);
  });
  return uniq(codes);
};

export const mobileMoneySupportedCountries = () => {
  const countries = ["KE", "GH", "RW", "CM"];
  return countries.map((country) => {
    const currency = countriesToCurrencies[country];
    return { label: currency, value: currency };
  });
};

export const bankTransferSupportedCountries = () => {
  const countries = ["NG", "KE", "GH", "ZM"];
  return countries.map((country) => {
    const currency = countriesToCurrencies[country];
    return { label: currency, value: currency };
  });
};
