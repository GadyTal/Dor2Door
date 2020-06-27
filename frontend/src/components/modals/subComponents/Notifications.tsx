import React, { FC, useState } from "react";
import { PrimaryBtn } from "../../core";
import { useHomepageState } from "../../hooks";
import { setSubscription } from "../../../services/Volunteer.service";
import { Stack, Space } from "../../stages/new-submission/Style";
import { CheckboxLabel, CheckboxText, CheckboxIcon } from "../../stages/new-submission/Checkbox";

export const Notifications: FC = () => {
  const { volunteer } = useHomepageState()!;
  const { is_subscribed } = volunteer;

  const [subscribed, setSubscribed] = useState<boolean>(is_subscribed);

  const handleSubscribe = () => {
    setSubscribed((subscribed) => !subscribed);
  };

  const handleSubmit = async () => {
    try {
      const response = await setSubscription(subscribed);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="settings-edit-container">
        <Stack>
          <CheckboxLabel
            checked={subscribed}
            onStateChange={handleSubscribe}>
            <CheckboxIcon />
            <Space horizontal />
            <CheckboxText type="normal">
              קבלת התראות על התנדבויות בקרבתך
          </CheckboxText>
          </CheckboxLabel>
        </Stack>
      </div>
      <PrimaryBtn handleClick={handleSubmit}>שמירה</PrimaryBtn>
    </>
  );
};
