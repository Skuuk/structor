import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    addQuestionnaireCodeAction,
    deleteQuestionnaireCodeAction,
    updateQuestionnaireCodePropertyAction,
} from '../../store/treeStore/treeActions';
import Btn from '../Btn/Btn';
import { Coding } from '../../types/fhir';
import createUUID from '../../helpers/CreateUUID';
import { ICodingProperty } from '../../types/IQuestionnareItemType';
import { TreeContext } from '../../store/treeStore/treeStore';
import UriField from '../FormField/UriField';
import { createUriUUID } from '../../helpers/uriHelper';
import { ValidationErrors } from '../../helpers/orphanValidation';
import FormField from '../FormField/FormField';
import InputField from '../InputField/inputField';
import Accordion from '../Accordion/Accordion';

type CodeProps = {
    index: number;
    coding: Coding;
    itemValidationErrors: ValidationErrors[];
};

const Codes = ({ index, itemValidationErrors }: CodeProps): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);

    const codes = state.qCodes.codes.map((item) => {
        // Add id (for internal usage) if not already set
        return { ...item, id: item.id || createUUID() };
    });

    const createEmptyCode = (): Coding => {
        return { code: '', display: '', system: createUriUUID(), id: createUUID() };
    };

    const updateCode = (index: number, prop: ICodingProperty, value: string) => {
        dispatch(updateQuestionnaireCodePropertyAction(index, prop, value));
    };

    const renderCode = (code: Coding, index: number) => {
        const hasValidationError = itemValidationErrors.some(
            (x) => x.errorProperty.substr(0, 4) === 'code' && index === x.index,
        );
        return (
            <Accordion title={t('Questionnaire codes')}>
                <div key={`${code.id}`} className={`code-section ${hasValidationError ? 'validation-error' : ''}`}>
                    <div className="horizontal equal">
                        <FormField label={t('Display')}>
                            <InputField
                                defaultValue={code.display}
                                onBlur={(event) => updateCode(index, ICodingProperty.display, event.target.value)}
                            />
                        </FormField>
                        <FormField label={t('Code')}>
                            <InputField
                                defaultValue={code.code}
                                onBlur={(event) => updateCode(index, ICodingProperty.code, event.target.value)}
                            />
                        </FormField>
                    </div>
                    <div className="horizontal full">
                        <FormField label={t('System')}>
                            <UriField
                                value={code.system}
                                onBlur={(event) => updateCode(index, ICodingProperty.system, event.target.value)}
                            />
                        </FormField>
                    </div>
                    <div className="center-text">
                        <Btn
                            title={`- ${t('Remove Code')}`}
                            type="button"
                            onClick={() => dispatch(deleteQuestionnaireCodeAction(index))}
                            variant="secondary"
                        />
                    </div>
                    <hr style={{ margin: '24px 0px' }} />
                </div>
            </Accordion>
        );
    };

    return (
        <div className="codes">
            {codes && codes.map((code, index) => renderCode(code, index))}
            <div className="center-text">
                <Btn
                    title={`+ ${t('Add Code')}`}
                    type="button"
                    onClick={() => {
                        dispatch(addQuestionnaireCodeAction(index, createEmptyCode()));
                    }}
                    variant="primary"
                />
            </div>
        </div>
    );
};

export default Codes;
