import { Button, Input, InputNumber, Progress, message as antdMessage } from "antd";
import { CampaignTypeProps } from "../../../interfaces";
import { useState } from "react";
import axios from "axios";

function DonationsCard({
  campaignData,
  reloadCampaignData,
}: {
  campaignData: CampaignTypeProps;
  reloadCampaignData: () => void;
}) {
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState("");
  const [clientSecretToken, setClientSecretToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const getClientSecretToken = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/payments/create-payment-intent", {
        amount,
      });
      setClientSecretToken(response.data.clientSecret);
      setShowCheckoutForm(true);
    } catch (error: any) {
      antdMessage.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    clientSecret: clientSecretToken,
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      {/* Campaign Progress */}
      <div className="mb-6">
        <Progress
          percent={Number(
            (
              (campaignData.collectedAmount / campaignData.targetAmount) *
              100
            ).toFixed(2)
          )}
          strokeColor="#4caf50"
          className="mb-3"
        />
        <h1 className="text-lg font-semibold text-gray-900">
          ${campaignData.collectedAmount} raised of ${campaignData.targetAmount}
        </h1>
      </div>

      {/* Donation Amount */}
      <div className="mb-5">
        <label htmlFor="amount" className="text-sm text-gray-700 font-medium">
          Donation Amount
        </label>
        <InputNumber
          id="amount"
          className="w-full mt-2"
          type="number"
          value={amount}
          onChange={(value) => setAmount(value as number)}
          min={1}
          step={1}
          formatter={(value) => `$ ${value}`}
        />
      </div>

      {/* Message */}
      <div className="mb-5">
        <label htmlFor="message" className="text-sm text-gray-700 font-medium">
          Leave a Message
        </label>
        <Input.TextArea
          id="message"
          className="w-full mt-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional message"
          rows={4}
        />
      </div>

      {/* Donate Button */}
      <Button
        type="primary"
        block
        className="mt-5 py-3 text-lg font-medium bg-teal-500 hover:bg-teal-600 transition-colors"
        onClick={getClientSecretToken}
        loading={loading}
      >
        Donate
      </Button>
    </div>
  );
}

export default DonationsCard;
