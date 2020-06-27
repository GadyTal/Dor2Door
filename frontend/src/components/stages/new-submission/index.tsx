import React from "react";
import { FirstPartForm } from "./FirstPart";
import { Switch, Route, useRouteMatch } from "react-router";
import { SecondPartForm } from "./SecondPart";
import { ThirdPartForm } from "./ThirdPart";
import { StepState } from "./StepState";
import { ForWhomForm } from "./ForWhom";
import { LegalForm } from "./LegalForm";
import { SuccessPage } from "./Success";

export default function NewSubmission() {
  const match = useRouteMatch();
  return (
    <StepState>
      <Switch>
        <Route path={`${match.path}/1`} component={FirstPartForm} />
        <Route path={`${match.path}/2`} component={SecondPartForm} />
        <Route path={`${match.path}/3`} component={ThirdPartForm} />
        <Route path={`${match.path}/4`} component={LegalForm} />
        <Route path={`${match.path}/success`} component={SuccessPage} />
        <Route component={ForWhomForm} />
      </Switch>
    </StepState>
  );
}
