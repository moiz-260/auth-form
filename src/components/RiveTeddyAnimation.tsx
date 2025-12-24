import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export interface RiveTeddyAnimationRef {
    handleEmailFocus: () => void;
    handleEmailBlur: () => void;
    handlePasswordFocus: () => void;
    handlePasswordBlur: () => void;
    triggerSuccess: () => void;
    triggerFail: () => void;
    updateEmailLook: (emailLength: number) => void;
}

const RiveTeddyAnimation = forwardRef<RiveTeddyAnimationRef>((props, ref) => {
    const STATE_MACHINE_NAME = "Login Machine";
    const INPUT_Name = "isChecking";
    const INPUT_HandsUp = "isHandsUp";
    const INPUT_Look = "numLook";
    const INPUT_Success = "trigSuccess";
    const INPUT_Fail = "trigFail";

    const { rive, RiveComponent } = useRive({
        src: "/teddy.riv",
        autoplay: true,
        stateMachines: STATE_MACHINE_NAME,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    const isCheckingInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_Name);
    const isHandsUpInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_HandsUp);
    const numLookInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_Look);
    const trigSuccessInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_Success);
    const trigFailInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_Fail);

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
        handleEmailFocus: () => {
            if (isCheckingInput) isCheckingInput.value = true;
        },
        handleEmailBlur: () => {
            if (isCheckingInput) isCheckingInput.value = false;
        },
        handlePasswordFocus: () => {
            if (isHandsUpInput) isHandsUpInput.value = true;
        },
        handlePasswordBlur: () => {
            if (isHandsUpInput) isHandsUpInput.value = false;
        },
        triggerSuccess: () => {
            if (trigSuccessInput) trigSuccessInput.fire();
        },
        triggerFail: () => {
            if (trigFailInput) trigFailInput.fire();
        },
        updateEmailLook: (emailLength: number) => {
            if (numLookInput) {
                numLookInput.value = emailLength * 5;
            }
        }
    }));

    return (
        <div className="w-full h-[220px] rounded-2xl overflow-hidden bg-white/40">
            <RiveComponent />
        </div>
    );
});

RiveTeddyAnimation.displayName = 'RiveTeddyAnimation';

export default RiveTeddyAnimation;