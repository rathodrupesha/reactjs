/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";

const useStyles = makeStyles(styles);

export default function Icons() {
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Reports</h4>
            <p className={classes.cardCategoryWhite}>
              
              
            </p>
          </CardHeader>
          <CardBody>
           
              <GridItem xs={12} sm={12} md={6}>
                <h5>
                 All Your Reports will show up here.
                  
                </h5>
              </GridItem>
            
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
