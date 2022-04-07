import { Row, Container, Col } from 'react-bootstrap';
import { Async, AsyncProps } from 'react-async';
import update from 'immutability-helper';
import { Section, Loader, BrandedComponentProps } from '@innexgo/common-react-components';
import ErrorMessage from '../components/ErrorMessage';
import ExternalLayout from '../components/ExternalLayout';

function ArticleSearch(props: BrandedComponentProps) {
  return <ExternalLayout branding={props.branding} fixed={true} transparentTop={true}>
    <Container fluid className="py-4 px-4">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Section id="goalIntents" name="My Goals">
            Test Text
          </Section>
        </Col>
      </Row>
    </Container>
  </ExternalLayout>
}

export default ArticleSearch;
