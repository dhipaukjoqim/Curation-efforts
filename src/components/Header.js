import { Header, Button } from 'semantic-ui-react'
import { Component } from 'react'

class HeaderContent extends Component {
    
    render() {
        return (
            <div style={{ display: "inline" }}>
                <Header 
                    as='h2'
                    style={{marginTop: "30px", marginBottom: "30px" }}
                >
                    Automation Impacts Curation efforts
                </Header>
            </div>
        );
    }
}

export default HeaderContent;