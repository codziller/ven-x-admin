import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "components/General/Button/Button";
import Textarea from "components/General/Textarea/Textarea";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import ImagePicker from "components/General/Input/ImagePicker";
import { MEDIA_MODAL_TYPES } from "utils/appConstant";
import Input from "components/General/Input/Input";
import { isArray, isEmpty } from "lodash";

import MarketingStore from "../store";
import DetailsModal from "./DetailsModal";
import { observer } from "mobx-react-lite";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";
import cleanPayload from "utils/cleanPayload";
import CheckBox from "components/General/Input/CheckBox";
import { errorToast } from "components/General/Toast/Toast";

const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;

const Form = observer(() => {
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  const schema = yup.object({});

  const { editMarketingText, marketingText, loadingMarketingText } =
    MarketingStore;

  const defaultValues = {
    donationDescriptionText: marketingText?.donationDescriptionText || "",
    donationImageUrl: marketingText?.donationImageUrl || [],
    donationTitleText: marketingText?.donationTitleText || "",
    donationUrlToLinkTo: marketingText?.donationUrlToLinkTo || "",
    appOrderDiscountText: marketingText?.appOrderDiscountText || "",
    emailExclusiveText: marketingText?.emailExclusiveText || "",
    freeShippingText: marketingText?.freeShippingText || "",
    loyaltyText: marketingText?.loyaltyText || "",
    appOrderDiscountTextVisibility:
      !!marketingText?.appOrderDiscountTextVisibility,
    emailExclusiveTextVisibility: !!marketingText?.emailExclusiveTextVisibility,
    freeShippingTextVisibility: !!marketingText?.freeShippingTextVisibility,
    loyaltyTextVisibility: !!marketingText?.loyaltyTextVisibility,
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const handleChange = async ({ prop, val }) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    donationDescriptionText: watch("donationDescriptionText"),
    donationImageUrl: watch("donationImageUrl"),
    donationUrlToLinkTo: watch("donationUrlToLinkTo"),
    donationTitleText: watch("donationTitleText"),
    appOrderDiscountText: watch("appOrderDiscountText"),
    emailExclusiveText: watch("emailExclusiveText"),
    freeShippingText: watch("freeShippingText"),
    loyaltyText: watch("loyaltyText"),

    appOrderDiscountTextVisibility: watch("appOrderDiscountTextVisibility"),
    emailExclusiveTextVisibility: watch("emailExclusiveTextVisibility"),
    freeShippingTextVisibility: watch("freeShippingTextVisibility"),
    loyaltyTextVisibility: watch("loyaltyTextVisibility"),
  };

  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);

    try {
      const imagesUrls = await uploadImageToCloud(
        isArray(form?.donationImageUrl)
          ? form?.donationImageUrl?.[0]
          : form?.donationImageUrl
      );
      const payload = {
        ...form,
        donationImageUrl: imagesUrls,
      };

      cleanPayload(payload);

      await editMarketingText({
        data: payload,
      });
    } catch (error) {
      console.log("imagesUrls error: ", error);
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
      handleChangeTwo("createLoading", false);
    }
  };

  return loadingMarketingText ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <>
      <div className="w-full h-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
              <h2 className="section-heading my-8 text-xl">
                Update General Marketing Text Content
              </h2>
              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
              >
                {/* First section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <span className="text-grey-text text-lg uppercase">
                      Donation
                    </span>
                    <span className="text-grey-text text-sm">
                      Provide details for the donations sections on the website
                      and mobile app.
                    </span>
                  </div>

                  <Input
                    label="Donation Title"
                    value={form?.donationTitleText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "donationTitleText", val })
                    }
                    placeholder="Give back to Charity"
                    formError={errors.donationTitleText}
                    showFormError={formTwo?.showFormError}
                  />

                  <Textarea
                    label="Donation Description"
                    value={form?.donationDescriptionText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "donationDescriptionText", val })
                    }
                    placeholder="Enter Description"
                    formError={errors.donationDescriptionText}
                    showFormError={formTwo?.showFormError}
                    required
                  />

                  <Input
                    label="Donation Link"
                    value={form?.donationUrlToLinkTo}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "donationUrlToLinkTo", val })
                    }
                    placeholder="Enter Donation Link"
                    formError={errors.donationUrlToLinkTo}
                    showFormError={formTwo?.showFormError}
                  />

                  <ImagePicker
                    label="Select Donation Image "
                    handleDrop={(val) =>
                      handleChange({ prop: "donationImageUrl", val })
                    }
                    images={form.donationImageUrl}
                    multiple={false}
                    dimension={{ width: "55px", height: "68px" }}
                  />
                </div>

                {/* Second section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <span className="text-grey-text text-lg uppercase">
                      Header Texts
                    </span>
                    <span className="text-grey-text text-sm">
                      Provide text content for the marketing section on the
                      website header.
                    </span>
                  </div>

                  <Input
                    label="Free Shipping Text"
                    value={form?.freeShippingText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "freeShippingText", val })
                    }
                    placeholder="Free shipping over ₦13,000.00"
                    formError={errors.freeShippingText}
                    showFormError={formTwo?.showFormError}
                  />
                  <CheckBox
                    label="Hide Free Shipping Text"
                    onChange={() =>
                      handleChange({
                        prop: "freeShippingTextVisibility",
                        val: !form.freeShippingTextVisibility,
                      })
                    }
                    checked={form?.freeShippingTextVisibility}
                  />
                  <hr className="w-full my-2" />
                  <Input
                    label="Loyalty Text"
                    value={form?.loyaltyText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "loyaltyText", val })
                    }
                    placeholder="Earn Beauty Hut Status Points"
                    formError={errors.loyaltyText}
                    showFormError={formTwo?.showFormError}
                  />
                  <CheckBox
                    label="Hide Loyalty Text"
                    onChange={() =>
                      handleChange({
                        prop: "loyaltyTextVisibility",
                        val: !form.loyaltyTextVisibility,
                      })
                    }
                    checked={form?.loyaltyTextVisibility}
                  />
                  <hr className="w-full my-2" />
                  <Input
                    label="App Order Discount Text"
                    value={form?.appOrderDiscountText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appOrderDiscountText", val })
                    }
                    placeholder="15% off your app order"
                    formError={errors.appOrderDiscountText}
                    showFormError={formTwo?.showFormError}
                  />
                  <CheckBox
                    label="Hide App Order Discount Text"
                    onChange={() =>
                      handleChange({
                        prop: "appOrderDiscountTextVisibility",
                        val: !form.appOrderDiscountTextVisibility,
                      })
                    }
                    checked={form?.appOrderDiscountTextVisibility}
                  />
                  <hr className="w-full my-2" />
                  <Input
                    label="Email Exclusive Text"
                    value={form?.emailExclusiveText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "emailExclusiveText", val })
                    }
                    placeholder="Sign up for email exclusives"
                    formError={errors.emailExclusiveText}
                    showFormError={formTwo?.showFormError}
                  />

                  <CheckBox
                    label="Hide Email Exclusive Text"
                    onChange={() =>
                      handleChange({
                        prop: "emailExclusiveTextVisibility",
                        val: !form.emailExclusiveTextVisibility,
                      })
                    }
                    checked={form?.emailExclusiveTextVisibility}
                  />
                </div>
                {/* Third section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
                  <Button
                    onClick={() =>
                      setFormTwo({ ...formTwo, showFormError: true })
                    }
                    isLoading={formTwo.createLoading}
                    type="submit"
                    text="Save Changes"
                    className="mt-8 mb-5"
                    fullWidth
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DetailsModal
        active={formTwo?.modalType === BRAND}
        details={{ prop: "dataId", modalType: BRAND }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT}
        details={{ prop: "dataId", modalType: PRODUCT }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
    </>
  );
});

const AddHomePageSlider = () => {
  const { loadingMarketingText, getMarketingText, marketingText } =
    MarketingStore;

  useEffect(() => {
    getMarketingText();
  }, []);
  return loadingMarketingText || isEmpty(marketingText) ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePageSlider);
