import { Form, Input } from 'antd';

const ContactForm = () => {
  return (
    <Form layout="vertical">
      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input type="tel" />
      </Form.Item>

      <Form.Item name="state" label="State">
        <Input />
      </Form.Item>

      <Form.Item name="city" label="City">
        <Input />
      </Form.Item>

      <Form.Item name="country" label="Country">
        <Input />
      </Form.Item>

      <Form.Item
        name="pincode"
        label="PIN Code"
        rules={[{ required: true, message: 'Please input your PIN code!' }]}
      >
        <Input type="number" />
      </Form.Item>
    </Form>
  );
};

export default ContactForm;
