import React from "react";
import UserCell from "./UserCell/index";
import { Tabs, Spin, Row, Icon } from "antd";
import { FetchAllUser } from "../../../services/chat.services";

const { TabPane } = Tabs;
const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

export default class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      EmployeeList: null,
      CustomerList: null,
      onSelectUser: null,
      selectedSectionId: null,
      contactList: null,
    };
  }

  componentDidMount() {
    FetchAllUser()
      .then((response) => {
        const { employees, customers } = response.data;
        const { contactList, onSelectUser, selectedSectionId } = this.props;

        const CustomerList = contactList.filter((c) => {
          for (let index = 0; index < customers.length; index++) {
            const myId = customers[index]._id;
            if (c.user.userId == myId) {
              return c;
            }
          }
        });

        const EmployeeList = contactList.filter((c) => {
          for (let index = 0; index < employees.length; index++) {
            const myId = employees[index]._id;
            if (c.user.userId == myId) {
              return c;
            }
          }
        });

        this.setState({
          EmployeeList,
          CustomerList,
          onSelectUser,
          selectedSectionId,
          contactList,
          loading: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {
      selectedSectionId,
      onSelectUser,
      CustomerList,
      EmployeeList,
    } = this.state;
    return (
      <React.Fragment>
        {this.state.loading ? (
          <div className="gx-chat-user">
            <Tabs
              defaultActiveKey="employee"
              className="gx-tabs-half"
              size={"small"}
              style={{ textAlign: "center" }}
            >
              <TabPane
                tab="Employee"
                label="Employee"
                key="employee"
                style={{ textAlign: "left" }}
              >
                {EmployeeList.length > 0 ? (
                  <React.Fragment>
                    {EmployeeList.map((channel, index) => (
                      <UserCell
                        key={index}
                        channel={channel}
                        selectedSectionId={selectedSectionId}
                        onSelectUser={onSelectUser}
                      />
                    ))}
                    {EmployeeList.length}
                  </React.Fragment>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    No Employee in your contact
                  </p>
                )}
              </TabPane>
              <TabPane
                label="Customer"
                tab="Customer"
                key="customer"
                style={{ textAlign: "left" }}
              >
                {CustomerList.length > 0 ? (
                  <React.Fragment>
                    {CustomerList.map((channel, index) => (
                      <UserCell
                        key={index}
                        channel={channel}
                        selectedSectionId={selectedSectionId}
                        onSelectUser={onSelectUser}
                      />
                    ))}
                  </React.Fragment>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    No Customer in your contact
                  </p>
                )}
              </TabPane>
            </Tabs>
          </div>
        ) : (
          <Row style={{ textAlign: "center" }}>
            <Spin indicator={antIcon} size={"small"} />
          </Row>
        )}
      </React.Fragment>
    );
  }
}

// const ContactList = ({ onSelectUser, selectedSectionId, contactList }) => {
//   let EmployeeList;
//   let CustomerList;

//   return (
//     <div className="gx-chat-user">
//       <Tabs
//         defaultActiveKey="1"
//         onChange={callback}
//         className="gx-tabs-half"
//         style={{ textAlign: "center" }}
//       >
//         <TabPane tab="Employee" key="employee">
//           Employee
//         </TabPane>
//         <TabPane tab="  Customer" key="customer">
//           {CustomerList ? (
//             <React.Fragment>
//               {CustomerList.map((channel, index) => (
//                 <UserCell
//                   key={index}
//                   channel={channel}
//                   selectedSectionId={selectedSectionId}
//                   onSelectUser={onSelectUser}
//                 />
//               ))}
//             </React.Fragment>
//           ) : (
//             <p>No Employee in your contact</p>
//           )}
//         </TabPane>
//       </Tabs>
//       {/* {contactList.map((channel, index) => (
//         <UserCell
//           key={index}
//           channel={channel}
//           selectedSectionId={selectedSectionId}
//           onSelectUser={onSelectUser}
//         />
//       ))} */}
//     </div>
//   );
// };

// export default ContactList;
