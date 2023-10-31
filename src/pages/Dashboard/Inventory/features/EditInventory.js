import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import ProductsStore from "pages/Dashboard/Products/store";
import Form from "./Form";

const EditInventory = () => {
  const { product_id } = useParams();
  const { getProduct, getProductLoading } = ProductsStore;
  useEffect(() => {
    product_id && getProduct({ data: { id: product_id } });
  }, [product_id]);
  return (
    <>
      <div className="h-full md:pr-4 pt-1 w-full flex justify-center items-start">
        {getProductLoading ? (
          <CircleLoader blue />
        ) : (
          <Form
            details={{
              isAdd: true,
              link: "/dashboard/products/warehouse_id",
            }}
          />
        )}
      </div>
    </>
  );
};

export default observer(EditInventory);
