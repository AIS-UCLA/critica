import { Row, Container, Col } from 'react-bootstrap';
import { Async, AsyncProps } from 'react-async';
import update from 'immutability-helper';
import { Section, Loader, BrandedComponentProps } from '@innexgo/common-react-components';
import ErrorMessage from '../components/ErrorMessage';
import ExternalLayout from '../components/ExternalLayout';

import { ArticleData, ArticleSection, articleDataViewPublic, articleSectionViewPublic } from '../utils/api';
import { unwrap, getFirstOr } from '@innexgo/frontend-common';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';

type Data = {
  articleData: ArticleData,
  articleSection: ArticleSection[],
}

const loadData = async (props: AsyncProps<Data>) => {
  const articleData =
    await articleDataViewPublic({
      articleId: [props.articleId]
    })
      .then(unwrap)
      .then(x => getFirstOr(x, "NOT_FOUND"))
      .then(unwrap);

  const articleSection =
    await articleSectionViewPublic({
      articleId: [props.articleId]
    })
      .then(unwrap);

  return {
    articleData,
    articleSection
  }
}

type ManageArticleSectionProps = {
  sections: ArticleSection[],
  position: number,
};

function ManageArticleSection(props: ManageArticleSectionProps) {
  // select true sections and sort them
  let ordered_sections = props.sections.filter(x => x.variant == 0).sort((a, b) => a.position - b.position);

  // select those sections with a smaller position
  let visible_ordered_sections = ordered_sections.filter(x => x.position <= props.position);

  // select the possible selections for the next one
  let possible_new_sections = ordered_sections.filter(x => x.position === props.position + 1);

  return <div>{visible_ordered_sections.map(x => <p>{x.sectionText}</p>)}</div>
}

function ArticleView(props: BrandedComponentProps) {
  const articleId = parseInt(new URLSearchParams(window.location.search).get("articleId") ?? "");
  return <ExternalLayout branding={props.branding} fixed={false} transparentTop={true}>
    <Container className="py-4">
      <Async promiseFn={loadData} articleId={articleId}>
        {({ setData }) => <>
          <Async.Pending><Loader /></Async.Pending>
          <Async.Rejected>
            {e => <ErrorMessage error={e} />}
          </Async.Rejected>
          <Async.Fulfilled<Data>>{d =>
            <Section id="article" name={d.articleData.title}>
              <ManageArticleSection
                sections={d.articleSection}
                position={0}
              />
            </Section>
          }
          </Async.Fulfilled>
        </>}
      </Async>
    </Container>
  </ExternalLayout>
}

export default ArticleView;
