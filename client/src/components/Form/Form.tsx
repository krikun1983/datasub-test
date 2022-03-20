import React, {ChangeEvent, useEffect, useState} from 'react';
import {
  Row,
  Col,
  Divider,
  Typography,
  DatePicker,
  Button,
  Form,
  Input,
  InputNumber,
} from 'antd';
import moment from 'moment';
import './Form.scss';

type DataType = {
  cardNumber: string;
  expDate: string;
  cvv: string;
  amount: number;
};
type ErrorType = {
  CardNumber: boolean;
  Cvv: boolean;
};

const MyForm: React.FC = () => {
  const {Title} = Typography;
  const [cardValue, setCardValue] = useState<DataType>({
    cardNumber: '',
    expDate: '03/2022',
    cvv: '',
    amount: 1,
  });
  const [errorFieldsForm, setErrorFieldsForm] = useState<ErrorType>({
    CardNumber: true,
    Cvv: true,
  });
  const [btnForm, setBtnForm] = useState(true);
  const monthFormat = 'MM/YYYY';
  const cardNumberFull = 19;
  const cvvFull = 3;

  useEffect(() => {
    if (!errorFieldsForm.CardNumber && !errorFieldsForm.Cvv) {
      setBtnForm(false);
    } else {
      setBtnForm(true);
    }
  }, [errorFieldsForm.CardNumber, errorFieldsForm.Cvv]);

  const matrixFieldCardNumber = (value: string) => {
    if (!value) return;
    const matrix = '____-____-____-____';
    let i = 0;
    const val = value.replace(/\D+/g, '');

    return matrix.replace(/./g, function (sym) {
      return /[_\d]/.test(sym) && i < val.length
        ? val[i++]
        : i >= val.length
        ? ''
        : sym;
    });
  };

  const handleExpDate = (value: moment.Moment | null, dateString: string) => {
    setCardValue({...cardValue, expDate: dateString});
  };

  const handleCardNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > cardNumberFull) return;

    if (value.length === cardNumberFull) {
      setErrorFieldsForm({
        ...errorFieldsForm,
        CardNumber: false,
      });
    } else {
      setErrorFieldsForm({
        ...errorFieldsForm,
        CardNumber: true,
      });
    }
    const result = matrixFieldCardNumber(e.target.value);
    setCardValue({...cardValue, cardNumber: result as string});
  };

  const handleCvv = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D+/g, '');
    if (value.length > cvvFull) return;
    if (value.length === cvvFull) {
      setErrorFieldsForm({
        ...errorFieldsForm,
        Cvv: false,
      });
    } else {
      setErrorFieldsForm({
        ...errorFieldsForm,
        Cvv: true,
      });
    }
    setCardValue({...cardValue, cvv: value});
  };

  const handleAmount = (value: number) => {
    setCardValue({...cardValue, amount: value});
  };

  const handleSubmit = async () => {
    await fetch(`${'http://localhost:5000/api/payment/send'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        CardNumber: cardValue.cardNumber.replace(/-/g, ''),
        ExpDate: cardValue.expDate,
        Cvv: cardValue.cvv,
        Amount: cardValue.amount,
      }),
    })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.log(error.message));
    setCardValue({
      ...cardValue,
      cardNumber: '',
      cvv: '',
      amount: 1,
    });
    setErrorFieldsForm({
      CardNumber: true,
      Cvv: true,
    });
  };

  return (
    <Row justify={'center'}>
      <Col span={10}>
        <Title className="form__title" level={2}>
          Form of payment
        </Title>
        <Divider />
        <div className="form-wrapper">
          <Form className="form" name="payment">
            <Form.Item
              label="Card Number"
              hasFeedback
              validateStatus={errorFieldsForm.CardNumber ? 'error' : 'success'}
              help={errorFieldsForm.CardNumber ? 'Digit must be 16...' : ''}
            >
              <Input
                name="CardNumber"
                placeholder="Enter credit card number..."
                value={cardValue.cardNumber}
                onChange={handleCardNumber}
              />
            </Form.Item>
            <Row justify="space-between">
              <Col span={14}>
                <Form.Item label="Expiration Date">
                  <DatePicker
                    name="ExpDate"
                    defaultValue={moment('03/2022', monthFormat)}
                    picker="month"
                    onChange={handleExpDate}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Cvv"
                  hasFeedback
                  validateStatus={errorFieldsForm.Cvv ? 'error' : 'success'}
                  help={errorFieldsForm.Cvv ? 'Digit must be 3...' : ''}
                >
                  <Input.Password
                    placeholder="Enter credit card cvv..."
                    autoComplete="true"
                    name="Cvv"
                    value={cardValue.cvv}
                    onChange={handleCvv}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Amount" name="Amount" initialValue={1}>
              <InputNumber
                min={1}
                max={100}
                value={cardValue.amount}
                onChange={handleAmount}
              />
            </Form.Item>
            <Button
              block
              type="default"
              htmlType="submit"
              onClick={handleSubmit}
              disabled={btnForm}
            >
              Оплатить
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default MyForm;
