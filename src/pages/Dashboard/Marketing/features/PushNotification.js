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

    appVersionAndroidText: marketingText?.appVersionAndroidText || "",
    appVersionButtonLink: marketingText?.appVersionButtonLink || "",
    appVersionButtonText: marketingText?.appVersionButtonText || "",
    appVersionHeaderText: marketingText?.appVersionHeaderText || "",
    appVersionIosText: marketingText?.appVersionIosText || "",
    appVersionMainText: marketingText?.appVersionMainText || "",
    appVersionSkipBool: !!marketingText?.appVersionSkipBool,
    appVersionSkipText: marketingText?.appVersionSkipText || "",
    appVersionWhatsNewText: marketingText?.appVersionWhatsNewText || "",
    appExploreImageUrl: marketingText?.appExploreImageUrl || [],
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

    appExploreImageUrl: watch("appExploreImageUrl"),
    appVersionAndroidText: watch("appVersionAndroidText"),
    appVersionButtonLink: watch("appVersionButtonLink"),
    appVersionButtonText: watch("appVersionButtonText"),
    appVersionHeaderText: watch("appVersionHeaderText"),
    appVersionIosText: watch("appVersionIosText"),
    appVersionMainText: watch("appVersionMainText"),
    appVersionSkipBool: watch("appVersionSkipBool"),
    appVersionSkipText: watch("appVersionSkipText"),
    appVersionWhatsNewText: watch("appVersionWhatsNewText"),
  };

  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);

    try {
      const imagesUrls = await uploadImageToCloud(
        isArray(form?.donationImageUrl)
          ? form?.donationImageUrl?.[0]
          : form?.donationImageUrl
      );

      const exploreImagesUrls = await uploadImageToCloud(
        isArray(form?.appExploreImageUrl)
          ? form?.appExploreImageUrl?.[0]
          : form?.appExploreImageUrl
      );
      const payload = {
        ...form,
        donationImageUrl: imagesUrls,
        appExploreImageUrl: exploreImagesUrls,
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
              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
              >
                {/* First section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <span className="text-grey-text text-lg uppercase">
                      Push Notification
                    </span>
                    <span className="text-grey-text text-sm">
                      Send push notfications to the app
                    </span>
                  </div>

                  <Input
                    label="Notification Title"
                    value={form?.tagline}
                    onChangeFunc={(val) => handleChange("tagline", val)}
                    placeholder="Enter Notification Title"
                    formError={errors.tagline}
                    showFormError={formTwo?.showFormError}
                  />

                  <Textarea
                    isRequired
                    label="Notification Body"
                    value={form?.appVersionAndroidText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionAndroidText", val })
                    }
                    placeholder="Enter Notification Body"
                    formError={errors.appVersionAndroidText}
                    showFormError={formTwo?.showFormError}
                    required
                  />

                  <Button
                    onClick={() =>
                      setFormTwo({ ...formTwo, showFormError: true })
                    }
                    isLoading={formTwo.createLoading}
                    type="submit"
                    text="Push Notification"
                    className="mt-8 mb-5"
                    fullWidth
                  />
                </div>

                {/* Second section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
                {/* Third section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
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
    // getMarketingText();
  }, []);
  return loadingMarketingText ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePageSlider);
