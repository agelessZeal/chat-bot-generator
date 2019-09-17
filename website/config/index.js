let config = {
    mode: 'local',
    port: 3000,

    mongo: {
        host: '127.0.0.1',
        port: 27017,
        dbname: 'chatbot_db',
    },

    info: {
        site_url: 'http://127.0.0.1:3000/',
        site_name: "ChatBot",
        domain: "127.0.0.1",
    },
    node_mail: {
        mail_account: "",
        password: ""
    },
    opening_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    customers_accept: ['New', 'Existing'],
    msg: {
        reply_text: 'Type Here / Select Option From Above',
        hi: 'Hi, Welcome to our website',
        are_you_our_patient: `Are you one of our Patients?`,
        yes_existing_patient: `Yes, I'm a an existing patient`,
        no_new_patient: `NO, I'm a new patient`,
        no_learn_more: `NO, I'm interested to learn more`,
        what_is_your_name: `Great, What is your name and are you interested in a Skin Treatment or a Dental Treatment?`,
        what_is_phone: `We're excited to help you out. Let us know your phone number so that we can follow up in case we get disconnected`,
        what_is_your_email: `What's your email address to reach you if we fail to reach you by phone.`,
        what_can_i_do_today: `What can I do for you today?`,
        to_book: `TO BOOK AN APPOINTMENT`,
        to_leave_msg: `I WANT TO LEAVE A MESSAGE`,
        to_ask_question: `I WANT TO ASK A QUESTION`,
        day_week_schedule: `On which day of the week would you like to schedule your appointment?`,
        what_time_of_day: `What time of the day do you prefer?`,
        msg_confirm: `To confirm your request for an appointment please click on the “Confirm” button. We will get back to you within one working day with THE CONFIRMED DATE AND TIME of your appointment.`,
        please_leave_your_msg: `Please leave your message and I will pass it along to our team.`,
        how_can_i_help: `Okay great, how can I help you?`,
        click_confirm_btn: `To confirm and send your message, please click on the “Confirm” button.`,
        we_will_back: `We will get back to you within one working day with THE CONFIRMED DATE AND TIME of your appointment.`,
        noted_summary: `Noted. Below is a summary of your appointment request`,
        thank_you_got_everything: `Thank you, I got everything. Below is a summary of the details you provided`,
        thank_you_last_string: `Thank you. I have sent your request to our team. Expect to hear from us shortly.`,
    }
};

module.exports = config;
