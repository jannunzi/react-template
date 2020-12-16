import SessionAttributes from "./components/session-attributes";
import {BrowserRouter, Link, Route} from "react-router-dom";
import DataTable from "./components/generic/DataTable";
import {DataRecord} from "./components/generic/DataRecord";

function App() {
  return (
    <BrowserRouter>
      <br/>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3">
            <div className="list-group">
              <Link to="/session-attributes" className="list-group-item">
                Session Attributes
              </Link>
              <Link to="/generic/courses" className="list-group-item">
                Generic Courses
              </Link>
              <Link to="/generic/courses/record" className="list-group-item">
                Generic Courses Record
              </Link>
              <Link to="/generic/users" className="list-group-item">
                Generic Users
              </Link>
            </div>
          </div>
          <div className="col-9">
            <Route path="/session-attributes">
              <SessionAttributes/>
            </Route>
            <Route path="/generic/courses" exact>
              <DataTable
                primaryKey="_id"
                schema={[
                  {name: "_id", type: String,label:"ID"},
                  {name: "title",type: String,label:"Title", default: "New Course"},
                  {name: "startDate",type:Date,label:"Start Date"},
                  {name: "seats",type:Number,label:"Seats"},
                  {name: "full",type:Boolean,label:"Full"},
                  {name: "semester",type:String,oneOf:["Fall", "Summer", "Spring"],widget:"radio",label:"Semester"},
                  {name: "topics",type:String,anyOf:["HTML", "JavaScript", "CSS"],widget:"checkbox",label:"Topics"},
                ]}
                detailLink="/generic/courses/:id"
                defaultRecord={{title: "New Course"}}
                table={{name:"courses", label:"Courses"}}/>
            </Route>
            <Route path="/generic/users" exact>
              <DataTable
                primaryKey="_id"
                schema={[
                  {name: "_id", type:String,label:"ID"},
                  {name: "username",type:String,label:"Username"},
                  {name: "password",type:String,label:"Password"},
                  {name: "firstName",type:String,label:"First Name"},
                  {name: "lastName",type:String,label:"Last Name"},
                ]}
                table={{name:"users", label:"Users"}}/>
            </Route>
            <Route path={[
              "/generic/courses/record",
              "/generic/courses/:id"
            ]} exact>
              <DataRecord
                primaryKey="_id"
                pathIdIndex={3}
                cancelUrl="/generic/courses"
                cancelLink="/generic/courses"
                schema={[
                  {name: "_id", type: String,label:"ID"},
                  {name: "title",type: String,label:"Title", default: "New Course"},
                  {name: "startDate",type:Date,label:"Start Date"},
                  {name: "seats",type:Number,label:"Seats"},
                  {name: "semester",type:String,enum:["Fall", "Summer", "Spring"],label:"Semester"}
                ]}
                table={{name:"courses", label:"Course"}}/>
            </Route>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
