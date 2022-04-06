use super::handlers;
use super::utils;
use super::Config;
use super::Db;
use super::SERVICE_NAME;
use auth_service_api::client::AuthService;
use std::convert::Infallible;
use std::future::Future;
use super::response;
use super::response::FakeJournalReaderError;
use warp::http::StatusCode;
use warp::Filter;

/// Helper to combine the multiple filters together with Filter::or, possibly boxing the types in
/// the process. This greatly helps the build times for `ipfs-http`.
/// https://github.com/seanmonstar/warp/issues/507#issuecomment-615974062
macro_rules! combine {
  ($x:expr, $($y:expr),+) => {{
      let filter = ($x).boxed();
      $( let filter = (filter.or($y)).boxed(); )+
      filter
  }}
}

/// The function that will show all ones to call
pub fn api(
    config: Config,
    db: Db,
    auth_service: AuthService,
) -> impl Filter<Extract = impl warp::Reply, Error = Infallible> + Clone {
    // public API
    combine!(
        api_info(),
        adapter(
            config.clone(),
            db.clone(),
            auth_service.clone(),
            warp::path!("public" / "article" / "new"),
            handlers::article_new,
        ),
        adapter(
            config.clone(),
            db.clone(),
            auth_service.clone(),
            warp::path!("public" / "article_data" / "new"),
            handlers::article_data_new,
        ),
        adapter(
            config.clone(),
            db.clone(),
            auth_service.clone(),
            warp::path!("public" / "article_section" / "new"),
            handlers::article_section_new,
        ),
        adapter(
            config.clone(),
            db.clone(),
            auth_service.clone(),
            warp::path!("public" / "article" / "view"),
            handlers::article_view,
        ),
        adapter(
            config.clone(),
            db.clone(),
            auth_service.clone(),
            warp::path!("public" / "article_data" / "view"),
            handlers::article_data_view,
        ),
        adapter(
            config.clone(),
            db.clone(),
            auth_service.clone(),
            warp::path!("public" / "article_section" / "view"),
            handlers::article_section_view,
        )
    )
    .recover(handle_rejection)
}

fn api_info() -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    let info = response::Info {
        service: SERVICE_NAME.to_owned(),
        version_major: 1,
        version_minor: 0,
        version_rev: 0,
    };
    warp::path!("public" / "info").map(move || warp::reply::json(&info))
}

// this function adapts a handler function to a warp filter
// it accepts an initial path filter
fn adapter<PropsType, ResponseType, F>(
    config: Config,
    db: Db,
    auth_service: AuthService,
    filter: impl Filter<Extract = (), Error = warp::Rejection> + Clone,
    handler: fn(Config, Db, AuthService, PropsType) -> F,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone
where
    F: Future<Output = Result<ResponseType, FakeJournalReaderError>> + Send,
    PropsType: Send + serde::de::DeserializeOwned,
    ResponseType: Send + serde::ser::Serialize,
{
    // lets you pass in an arbitrary parameter
    fn with<T: Clone + Send>(t: T) -> impl Filter<Extract = (T,), Error = Infallible> + Clone {
        warp::any().map(move || t.clone())
    }

    filter
        .and(with(config))
        .and(with(db))
        .and(with(auth_service))
        .and(warp::body::json())
        .and_then(move |config, db, auth_service, props| async move {
            handler(config, db, auth_service, props)
                .await
                .map_err(app_error)
        })
        .map(|x| warp::reply::json(&Ok::<ResponseType, ()>(x)))
}

// This function receives a `Rejection` and tries to return a custom
// value, otherwise simply passes the rejection along.
async fn handle_rejection(err: warp::Rejection) -> Result<impl warp::Reply, Infallible> {
    let code;
    let message;

    if err.is_not_found() {
        code = StatusCode::NOT_FOUND;
        message = FakeJournalReaderError::NotFound;
    } else if err
        .find::<warp::filters::body::BodyDeserializeError>()
        .is_some()
    {
        message = FakeJournalReaderError::DecodeError;
        code = StatusCode::BAD_REQUEST;
    } else if err.find::<warp::reject::MethodNotAllowed>().is_some() {
        code = StatusCode::METHOD_NOT_ALLOWED;
        message = FakeJournalReaderError::MethodNotAllowed;
    } else if let Some(FakeJournalReaderErrorRejection(app_error)) = err.find() {
        code = StatusCode::BAD_REQUEST;
        message = app_error.clone();
    } else {
        // We should have expected this... Just log and say its a 500
        utils::log(utils::Event {
            msg: "intercepted unknown error kind".to_owned(),
            source: format!("{:#?}", err),
            severity: utils::SeverityKind::Error,
        });
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = FakeJournalReaderError::Unknown;
    }

    Ok(warp::reply::with_status(
        warp::reply::json(&Err::<(), FakeJournalReaderError>(message)),
        code,
    ))
}

// This type represents errors that we can generate
// These will be automatically converted to a proper string later
#[derive(Debug)]
pub struct FakeJournalReaderErrorRejection(pub FakeJournalReaderError);
impl warp::reject::Reject for FakeJournalReaderErrorRejection {}

fn app_error(app_error: FakeJournalReaderError) -> warp::reject::Rejection {
    warp::reject::custom(FakeJournalReaderErrorRejection(app_error))
}
