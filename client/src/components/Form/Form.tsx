import { Row, Col, Divider, Typography, DatePicker, Button, Form, Input, InputNumber, FormInstance } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import './Form.scss';

type DataType = {
  CardNumber: string;
  ExpDate: string;
  Cvv: string;
  Amount: number;
}
type ErrorType = {
  CardNumber: boolean;
  ExpDate: boolean;
}

const _Form: React.FC = () => {
  const { Title } = Typography;
  const [expData, setExpData] = useState<string>('03/2022');
  const [errorFieldsForm, setErrorFieldsForm] = useState<ErrorType>({CardNumber: true, ExpDate: true});
  const [btnForm, setBtnForm] = useState(true);
  const monthFormat = 'MM/YYYY';
  const [form] = Form.useForm();
  const cardNumberFull = 16;
  const cvvFull = 3;
  const ref = useRef() as React.MutableRefObject<FormInstance>;

  useEffect(() => {
    if (!errorFieldsForm.CardNumber && !errorFieldsForm.ExpDate) {
      setBtnForm(false);
    } else {
      setBtnForm(true);
    }
  }, [errorFieldsForm.CardNumber, errorFieldsForm.ExpDate])

  const _matrixFieldCardNumber = (value: string) => {
    if (!value) return;
    let matrix = '____-____-____-____';
    let i = 0;
    let val = value.replace(/\D/g, '');

    return matrix.replace(/./g, function (sym) {
      return /[_\d]/.test(sym) && i < val.length
        ? val[i++]
        : i >= val.length
          ? ''
          : sym
    });
  }

  const handleExpDate = (value: moment.Moment | null, dateString: string) => {
    setExpData(dateString);
  };


  const handleSubmit = (e: DataType) => {
    console.log(
      JSON.stringify({
        CardNumber: e.CardNumber.replace(/-/g, ''),
        ExpDate: expData,
        Cvv: e.Cvv,
        Amount: e.Amount,
      })
    );
  }

  return (
    <Row justify={"center"}>
        <Col span={10}>
          <Title className="form__title" level={2}>Form of payment</Title>
          <Divider />
        <div className="form-wrapper">
          <Form ref={ref} className="form" onFinish={handleSubmit} name="payment" form={form}>
            <Form.Item
              name="CardNumber"
              label="Card Number"
              hasFeedback
              rules={[
              {
                required: true,
                message: "Digit must be 16"
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (typeof value === 'undefined') {
                    return Promise.reject();
                  }
                  if (value) {
                    ref.current!.setFieldsValue({ "CardNumber": value.replace(/\D/g, '').slice(0, cardNumberFull) });
                    setErrorFieldsForm({ ...errorFieldsForm, CardNumber: true });

                    if (getFieldValue("CardNumber").length === cardNumberFull) {
                      ref.current!.setFieldsValue({ "CardNumber": _matrixFieldCardNumber(value) });
                      return Promise.resolve().then(() => setErrorFieldsForm({...errorFieldsForm, CardNumber: false}));
                    }
                  }
                  return Promise.reject(`${cardNumberFull - value.length} character left`);
                }
              })

            ]}>
              <Input placeholder="Enter credit card number..." />
            </Form.Item>
            <Row justify="space-between">
              <Col span={14}>
                <Form.Item label="Expiration Date">
                   <DatePicker name="ExpDate" defaultValue={moment('03/2022', monthFormat)} picker="month" onChange={handleExpDate}/>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                    name="Cvv"
                    label="Cvv"
                    hasFeedback
                    rules={[
                    {
                      required: true,
                      message: "Enter credit card cvv..."
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (typeof value === 'undefined') {
                          return Promise.reject();
                        }
                        if (getFieldValue("Cvv")) {
                          setErrorFieldsForm({ ...errorFieldsForm, ExpDate: true });

                          if (value.length > cvvFull) {
                            ref.current!.setFieldsValue({ "Cvv": value.slice(0, 3) });
                          }
                          if (value.length > 2) {
                            return Promise.resolve().then(() => setErrorFieldsForm({...errorFieldsForm, ExpDate: false}));
                          }
                        }
                        return Promise.reject(`${cvvFull - value.length} character left`);
                      }
                    })
                  ]}
                >
                  <Input.Password placeholder="Enter credit card cvv..." autoComplete="true" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Amount" name="Amount" initialValue={1} >
              <InputNumber min={1} max={100}/>
            </Form.Item>
            <Button block type="default" htmlType='submit' disabled={btnForm}>Оплатить</Button>
          </Form>
      </div>
          </Col>
    </Row>
  );
};

export default _Form;