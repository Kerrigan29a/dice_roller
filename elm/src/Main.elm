port module Main exposing (main)

import Array exposing (Array)
import Browser
import Browser.Dom as Dom
import Browser.Navigation as Nav
import Base64
import Dict
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Keyed
import Http
import Json.Decode as D
import Json.Encode as E
import List.Extra
import Random
import Tables exposing (tables)
import Task
import Time exposing (Posix, Zone)
import Url


version : String
version =
    "0.9.0"


schemaVersion : Int
schemaVersion =
    2


type ThemeMode
    = Auto
    | Light
    | Dark


type ResultMode
    = AllDice
    | Highest
    | Lowest
    | Sum


resultModes : List ( ResultMode, String )
resultModes =
    [ ( AllDice, "All" ), ( Highest, "Max" ), ( Lowest, "Min" ), ( Sum, "Sum" ) ]


resultModeName : ResultMode -> String
resultModeName mode =
    resultModes
        |> List.Extra.find (\( choice, _ ) -> choice == mode)
        |> Maybe.map Tuple.second
        |> Maybe.withDefault "All"


resultModeDecoder : D.Decoder ResultMode
resultModeDecoder =
    D.maybe (D.field "resultMode" D.string)
        |> D.andThen
            (\stored ->
                case stored of
                    Nothing ->
                        D.succeed AllDice

                    Just name ->
                        case List.Extra.find (\( _, label_ ) -> String.toLower label_ == name) resultModes of
                            Just ( mode, _ ) ->
                                D.succeed mode

                            Nothing ->
                                D.fail "Unknown dice result mode"
            )


type Action
    = RollAction Int Int Bool ResultMode
    | AskAction String
    | ShowAction Int
    | ClearAction
    | ResetSeed Int


type alias RecordedAction =
    { action : Action
    , timestamp : Posix
    }


type alias PersistedState =
    { version : Int
    , seed : Int
    , actions : List RecordedAction
    , theme : ThemeMode
    }


type DecodedState
    = SupportedState PersistedState
    | NewerVersion Int


actionEncoder : RecordedAction -> E.Value
actionEncoder recorded =
    case recorded.action of
        RollAction sides amount explode resultMode ->
            E.object
                ([ ( "tag", E.string "roll" )
                 , ( "sides", E.int sides )
                 , ( "amount", E.int amount )
                 , ( "explode", E.bool explode )
                 , ( "ts", E.int (Time.posixToMillis recorded.timestamp) )
                 ]
                    ++ (if resultMode == AllDice then
                            []

                        else
                            [ ( "resultMode", E.string (String.toLower (resultModeName resultMode)) ) ]
                       )
                )

        AskAction table ->
            E.object
                [ ( "tag", E.string "ask" )
                , ( "table", E.string table )
                , ( "ts", E.int (Time.posixToMillis recorded.timestamp) )
                ]

        ShowAction iconAmount ->
            E.object
                [ ( "tag", E.string "show" )
                , ( "iconAmount", E.int iconAmount )
                , ( "ts", E.int (Time.posixToMillis recorded.timestamp) )
                ]

        ClearAction ->
            E.object
                [ ( "tag", E.string "clear" )
                , ( "ts", E.int (Time.posixToMillis recorded.timestamp) )
                ]

        ResetSeed value ->
            E.object
                [ ( "tag", E.string "resetSeed" )
                , ( "value", E.int value )
                , ( "ts", E.int (Time.posixToMillis recorded.timestamp) )
                ]


actionDecoder : D.Decoder RecordedAction
actionDecoder =
    let
        tsDecoder =
            D.oneOf
                [ D.field "ts" D.int |> D.map Time.millisToPosix
                , D.succeed (Time.millisToPosix 0)
                ]
    in
    D.map2
        (\timestamp action -> { action = action, timestamp = timestamp })
        tsDecoder
        (D.field "tag" D.string
            |> D.andThen
                (\tag ->
                    case tag of
                        "roll" ->
                            D.map4 RollAction
                                (D.field "sides" D.int)
                                (D.field "amount" D.int)
                                (D.field "explode" D.bool)
                                resultModeDecoder

                        "ask" ->
                            D.field "table" D.string |> D.map AskAction

                        "show" ->
                            D.field "iconAmount" D.int |> D.map ShowAction

                        "clear" ->
                            D.succeed ClearAction

                        "resetSeed" ->
                            D.field "value" D.int |> D.map ResetSeed

                        _ ->
                            D.fail "Unknown action tag"
                )
        )


decoder : D.Decoder PersistedState
decoder =
    D.map4 PersistedState
        (D.field "version" D.int
            |> D.map
                (\v ->
                    if v <= 0 then
                        1

                    else
                        v
                )
        )
        (D.field "seed" D.int)
        (D.field "actions" (D.list actionDecoder))
        (D.oneOf [ D.field "theme" (D.string |> D.map themeFromString), D.succeed Auto ])


savedStateDecoder : D.Decoder DecodedState
savedStateDecoder =
    D.field "version" D.int
        |> D.andThen
            (\storedVersion ->
                if storedVersion > schemaVersion then
                    D.succeed (NewerVersion storedVersion)

                else
                    D.map SupportedState decoder
            )


themeToString : ThemeMode -> String
themeToString themeMode =
    case themeMode of
        Auto ->
            "auto"

        Light ->
            "light"

        Dark ->
            "dark"


themeFromString : String -> ThemeMode
themeFromString value =
    case String.toLower value of
        "light" ->
            Light

        "dark" ->
            Dark

        _ ->
            Auto


formatTimestamp : Zone -> Posix -> String
formatTimestamp zone posix =
    let
        year =
            Time.toYear zone posix |> String.fromInt

        month =
            Time.toMonth zone posix
                |> (\m ->
                        case m of
                            Time.Jan ->
                                "01"

                            Time.Feb ->
                                "02"

                            Time.Mar ->
                                "03"

                            Time.Apr ->
                                "04"

                            Time.May ->
                                "05"

                            Time.Jun ->
                                "06"

                            Time.Jul ->
                                "07"

                            Time.Aug ->
                                "08"

                            Time.Sep ->
                                "09"

                            Time.Oct ->
                                "10"

                            Time.Nov ->
                                "11"

                            Time.Dec ->
                                "12"
                   )

        day =
            Time.toDay zone posix |> String.fromInt |> String.padLeft 2 '0'

        hour =
            Time.toHour zone posix |> String.fromInt |> String.padLeft 2 '0'

        minute =
            Time.toMinute zone posix |> String.fromInt |> String.padLeft 2 '0'

        second =
            Time.toSecond zone posix |> String.fromInt |> String.padLeft 2 '0'
    in
    year ++ "-" ++ month ++ "-" ++ day ++ " " ++ hour ++ ":" ++ minute ++ ":" ++ second


type Tool
    = DiceTool
    | WordTool
    | IconTool


type Session
    = OwnSession
    | SessionCopy
    | SharedSession


type SessionProblem
    = InvalidLink
    | MissingCopy
    | NewerFormat Int


type Catalog
    = CatalogLoading
    | CatalogReady (Array String)
    | CatalogFailed


type Entry
    = DiceResult ResultMode (List (List Int))
    | WordResult String
    | IconResult (List Int)


type alias HistoryItem =
    { action : Action
    , timestamp : Posix
    , result : Entry
    }


type alias Preferences =
    { tool : Tool
    , amount : String
    , sides : String
    , custom : Bool
    , explode : Bool
    , table : String
    , iconAmount : String
    , theme : ThemeMode
    , resultMode : ResultMode
    }


type alias Model =
    { preferences : Preferences
    , session : Session
    , problem : Maybe SessionProblem
    , saveIssue : Maybe String
    , seedValue : Int
    , seed : Random.Seed
    , seedReady : Bool
    , actions : List RecordedAction
    , history : List HistoryItem
    , showHistory : Bool
    , validation : Bool
    , catalog : Catalog
    , iconCount : Int
    , tableQuery : String
    , shareBase : String
    , shareLink : String
    , clipboard : Maybe Bool
    , zone : Zone
    }


type Msg
    = GotCatalog (Result Http.Error (List String))
    | RetryCatalog
    | SetPreferences Preferences
    | SelectTool Tool
    | RunTool
    | Repeat Action
    | Record Action Bool Posix
    | SeedGenerated Int
    | SeedCleared Int
    | ToggleHistory
    | SearchTables String
    | ChooseTable String
    | OpenDialog String
    | CloseDialog String
    | ConfirmClear
    | CopyLink
    | ClipboardResult Bool
    | SaveAsCopy
    | SaveIssue String
    | BackToOwnSession
    | UpdateApp
    | GotZone Zone
    | Navigate Browser.UrlRequest
    | NoOp


port saveSession : E.Value -> Cmd msg


port savePreferences : E.Value -> Cmd msg


port createCopy : E.Value -> Cmd msg


port ownSession : () -> Cmd msg


port reloadApp : () -> Cmd msg


port copyToClipboard : String -> Cmd msg


port clipboardResult : (Bool -> msg) -> Sub msg


port storageIssue : (String -> msg) -> Sub msg


port setDialog : { id : String, visible : Bool } -> Cmd msg


main : Program E.Value Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.batch [ clipboardResult ClipboardResult, storageIssue SaveIssue ]
        , onUrlRequest = Navigate
        , onUrlChange = \_ -> NoOp
        }


init : E.Value -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url _ =
    let
        fromFlags field decoder_ =
            D.decodeValue (D.field field decoder_) flags |> Result.toMaybe

        stored =
            fromFlags "session" savedStateDecoder

        inCopy =
            fromFlags "copy" D.bool |> Maybe.withDefault False

        shared =
            stateParameter url

        ( session, selected, missing ) =
            case shared of
                Just token ->
                    ( SharedSession, decodeStateFromString token, Just InvalidLink )

                Nothing ->
                    if inCopy then
                        ( SessionCopy, stored, Just MissingCopy )

                    else
                        ( OwnSession, stored, Nothing )

        ( saved, problem ) =
            case selected of
                Just (SupportedState state) ->
                    ( Just state, Nothing )

                Just (NewerVersion storedVersion) ->
                    ( Nothing, Just (NewerFormat storedVersion) )

                Nothing ->
                    ( Nothing, missing )

        startPreferences =
            defaults (Maybe.map .theme saved |> Maybe.withDefault Auto)

        preferences =
            fromFlags "preferences" (preferencesDecoder startPreferences)
                |> Maybe.withDefault startPreferences

        initial =
            { preferences = preferences
            , session = session
            , problem = problem
            , saveIssue = Nothing
            , seedValue = 0
            , seed = Random.initialSeed 0
            , seedReady = False
            , actions = []
            , history = []
            , showHistory = False
            , validation = False
            , catalog = CatalogLoading
            , iconCount = fromFlags "iconCount" D.int |> Maybe.withDefault 0
            , tableQuery = ""
            , shareBase = fromFlags "shareBase" D.string |> Maybe.withDefault ""
            , shareLink = ""
            , clipboard = Nothing
            , zone = Time.utc
            }

        model =
            case saved of
                Just state ->
                    List.foldl (\item -> recordAction item.action item.timestamp)
                        (startSeed state.seed initial)
                        state.actions

                Nothing ->
                    initial

        seedCommand =
            if saved == Nothing && problem == Nothing then
                Random.generate SeedGenerated sessionSeed

            else
                Cmd.none
    in
    ( model, Cmd.batch [ seedCommand, loadCatalog, Task.perform GotZone Time.here ] )


defaults : ThemeMode -> Preferences
defaults theme =
    { tool = DiceTool
    , amount = "1"
    , sides = "6"
    , custom = False
    , explode = False
    , table = Dict.keys tables |> List.head |> Maybe.withDefault ""
    , iconAmount = "3"
    , theme = theme
    , resultMode = AllDice
    }


toolName : Tool -> String
toolName tool =
    case tool of
        DiceTool ->
            "dice"

        WordTool ->
            "words"

        IconTool ->
            "icons"


toolFromName : String -> Tool
toolFromName name =
    case name of
        "words" ->
            WordTool

        "icons" ->
            IconTool

        _ ->
            DiceTool


preferencesDecoder : Preferences -> D.Decoder Preferences
preferencesDecoder initial =
    let
        optional field decoder_ fallback =
            D.oneOf [ D.field field decoder_, D.succeed fallback ]

        knownTable name =
            if Dict.member name tables then
                name

            else
                initial.table
    in
    D.map2 (\withMode mode -> withMode mode)
        (D.map8 Preferences
            (optional "tool" (D.map toolFromName D.string) initial.tool)
            (optional "amount" D.string initial.amount)
            (optional "sides" D.string initial.sides)
            (optional "custom" D.bool initial.custom)
            (optional "explode" D.bool initial.explode)
            (optional "table" (D.map knownTable D.string) initial.table)
            (optional "iconAmount" D.string initial.iconAmount)
            (optional "theme" (D.map themeFromString D.string) initial.theme)
        )
        (D.oneOf [ resultModeDecoder, D.succeed initial.resultMode ])


encodePreferences : Preferences -> E.Value
encodePreferences prefs =
    E.object
        [ ( "tool", E.string (toolName prefs.tool) )
        , ( "amount", E.string prefs.amount )
        , ( "sides", E.string prefs.sides )
        , ( "custom", E.bool prefs.custom )
        , ( "explode", E.bool prefs.explode )
        , ( "table", E.string prefs.table )
        , ( "iconAmount", E.string prefs.iconAmount )
        , ( "theme", E.string (themeToString prefs.theme) )
        , ( "resultMode", E.string (String.toLower (resultModeName prefs.resultMode)) )
        ]


encode : Model -> E.Value
encode model =
    let
        usesResultMode item =
            case item.action of
                RollAction _ _ _ mode ->
                    mode /= AllDice

                _ ->
                    False

        format =
            if List.any usesResultMode model.actions then
                schemaVersion

            else
                1
    in
    E.object
        [ ( "version", E.int format )
        , ( "seed", E.int model.seedValue )
        , ( "actions", E.list actionEncoder (List.reverse model.actions) )
        , ( "theme", E.string (themeToString model.preferences.theme) )
        ]


stateParameter : Url.Url -> Maybe String
stateParameter url =
    url.query
        |> Maybe.andThen
            (String.split "&"
                >> List.filter (String.startsWith "state=")
                >> List.head
                >> Maybe.map (String.dropLeft 6)
            )


decodeStateFromString : String -> Maybe DecodedState
decodeStateFromString encoded =
    Url.percentDecode encoded
        |> Maybe.andThen (Base64.decode >> Result.toMaybe)
        |> Maybe.andThen (D.decodeString savedStateDecoder >> Result.toMaybe)


loadCatalog : Cmd Msg
loadCatalog =
    Http.get
        { url = "./icons/icons.json"
        , expect = Http.expectJson GotCatalog iconsDecoder
        }


iconsDecoder : D.Decoder (List String)
iconsDecoder =
    D.field "icons" (D.dict (D.dict (D.list D.string)))
        |> D.map
            (Dict.toList
                >> List.concatMap
                    (\( size, authors ) ->
                        Dict.toList authors
                            |> List.concatMap
                                (\( author, icons ) ->
                                    List.map (\icon -> "./icons/ffffff/transparent/" ++ size ++ "/" ++ author ++ "/" ++ icon ++ ".svg") icons
                                )
                    )
                >> List.sort
            )


sessionSeed : Random.Generator Int
sessionSeed =
    Random.int 1 2147483646


startSeed : Int -> Model -> Model
startSeed value model =
    { model | seedValue = value, seed = Random.initialSeed value, seedReady = True }


canEdit : Model -> Bool
canEdit model =
    model.session /= SharedSession && model.problem == Nothing && model.seedReady


save : Model -> Cmd Msg
save model =
    if canEdit model then
        saveSession (encode model)

    else
        Cmd.none


positiveInt : String -> Maybe Int
positiveInt value =
    String.toInt value
        |> Maybe.andThen
            (\number ->
                if number > 0 && number <= 2147483647 then
                    Just number

                else
                    Nothing
            )


toolAction : Preferences -> Maybe Action
toolAction prefs =
    case prefs.tool of
        DiceTool ->
            Maybe.map2 (\sides amount -> RollAction sides amount prefs.explode prefs.resultMode)
                (positiveInt prefs.sides)
                (positiveInt prefs.amount)

        WordTool ->
            Just (AskAction prefs.table)

        IconTool ->
            Maybe.map ShowAction (positiveInt prefs.iconAmount)


iconAvailable : Model -> Bool
iconAvailable model =
    case model.catalog of
        CatalogReady _ ->
            True

        _ ->
            False


allowed : Model -> Action -> Bool
allowed model action =
    canEdit model
        && (case action of
                ShowAction _ ->
                    iconAvailable model

                _ ->
                    True
           )


recordNow : Bool -> Action -> Cmd Msg
recordNow scrollToResult action =
    Task.perform (Record action scrollToResult) Time.now


focus : String -> Cmd Msg
focus target =
    Task.attempt (\_ -> NoOp) (Dom.focus target)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotCatalog response ->
            let
                catalog =
                    case response of
                        Ok paths ->
                            if model.iconCount > 0 && List.length paths == model.iconCount then
                                CatalogReady (Array.fromList paths)

                            else
                                CatalogFailed

                        Err _ ->
                            CatalogFailed
            in
            ( { model | catalog = catalog }, Cmd.none )

        RetryCatalog ->
            ( { model | catalog = CatalogLoading }, loadCatalog )

        SetPreferences preferences ->
            ( { model | preferences = preferences, validation = False }
            , Cmd.batch
                [ savePreferences (encodePreferences preferences)
                , if preferences.tool == DiceTool && preferences.custom && not model.preferences.custom then
                    focus "dice-sides"

                  else
                    Cmd.none
                ]
            )

        SelectTool tool ->
            let
                prefs =
                    model.preferences

                ( updated, savePrefs ) =
                    update (SetPreferences { prefs | tool = tool }) model
            in
            ( updated, Cmd.batch [ savePrefs, focus (toolTabId tool) ] )

        RunTool ->
            case toolAction model.preferences of
                Just action ->
                    ( model
                    , if allowed model action then
                        recordNow False action

                      else
                        Cmd.none
                    )

                Nothing ->
                    let
                        prefs =
                            model.preferences

                        invalidField =
                            if prefs.tool == IconTool then
                                "icon-amount"

                            else if positiveInt prefs.amount == Nothing then
                                "dice-amount"

                            else
                                "dice-sides"
                    in
                    ( { model | validation = True }, focus invalidField )

        Repeat action ->
            ( model
            , if allowed model action then
                recordNow True action

              else
                Cmd.none
            )

        Record action focusResult timestamp ->
            if allowed model action then
                let
                    updated =
                        recordAction action timestamp model
                in
                ( updated
                , Cmd.batch
                    [ save updated
                    , if focusResult then
                        focus "latest-result"

                      else
                        Cmd.none
                    ]
                )

            else
                ( model, Cmd.none )

        SeedGenerated value ->
            let
                updated =
                    startSeed value model
            in
            ( updated, save updated )

        SeedCleared value ->
            let
                updated =
                    startSeed value
                        { model | actions = [], history = [], showHistory = False, problem = Nothing }
            in
            ( updated, save updated )

        ToggleHistory ->
            ( { model | showHistory = not model.showHistory }, Cmd.none )

        SearchTables query ->
            ( { model | tableQuery = query }, Cmd.none )

        ChooseTable table ->
            let
                prefs =
                    model.preferences

                updated =
                    { prefs | table = table }
            in
            ( { model | preferences = updated }
            , Cmd.batch [ closeDialog "table-dialog", savePreferences (encodePreferences updated) ]
            )

        OpenDialog id_ ->
            let
                prepared =
                    if id_ == "share-dialog" then
                        { model
                            | shareLink = model.shareBase ++ "?state=" ++ (encode model |> E.encode 0 |> Base64.encode |> Url.percentEncode)
                            , clipboard = Nothing
                        }

                    else
                        { model | tableQuery = "" }
            in
            ( prepared, setDialog { id = id_, visible = True } )

        CloseDialog id_ ->
            ( model, closeDialog id_ )

        ConfirmClear ->
            ( model, Cmd.batch [ closeDialog "clear-dialog", Random.generate SeedCleared sessionSeed ] )

        CopyLink ->
            ( model, copyToClipboard model.shareLink )

        ClipboardResult result ->
            ( { model | clipboard = Just result }, Cmd.none )

        SaveAsCopy ->
            ( model, createCopy (encode model) )

        SaveIssue reason ->
            ( { model | saveIssue = Just reason }, Cmd.none )

        BackToOwnSession ->
            ( model, ownSession () )

        UpdateApp ->
            ( model, reloadApp () )

        GotZone zone ->
            ( { model | zone = zone }, Cmd.none )

        Navigate request ->
            case request of
                Browser.Internal url ->
                    ( model, Nav.load (Url.toString url) )

                Browser.External url ->
                    ( model, Nav.load url )

        NoOp ->
            ( model, Cmd.none )


closeDialog : String -> Cmd Msg
closeDialog id_ =
    setDialog { id = id_, visible = False }


explosiveDieRoll : Int -> Random.Generator (List Int)
explosiveDieRoll sides =
    Random.int 1 sides
        |> Random.andThen
            (\roll ->
                if sides > 1 && roll == sides then
                    Random.map ((::) roll) (explosiveDieRoll sides)

                else
                    Random.constant [ roll ]
            )


recordAction : Action -> Posix -> Model -> Model
recordAction action timestamp model =
    let
        recorded =
            { action = action, timestamp = timestamp }

        generate generator toResult =
            let
                ( value, next ) =
                    Random.step generator model.seed
            in
            { model
                | seed = next
                , actions = recorded :: model.actions
                , history = { action = action, timestamp = timestamp, result = toResult value } :: model.history
            }
    in
    case action of
        RollAction sides amount explode resultMode ->
            generate
                (Random.list amount
                    (if explode then
                        explosiveDieRoll sides

                     else
                        Random.map List.singleton (Random.int 1 sides)
                    )
                )
                (DiceResult resultMode)

        AskAction name ->
            generate (Dict.get name tables |> Maybe.withDefault (Random.constant "Table not found")) WordResult

        ShowAction amount ->
            generate (Random.list amount (Random.int 0 (model.iconCount - 1))) IconResult

        ClearAction ->
            { model | actions = recorded :: model.actions, history = [] }

        ResetSeed value ->
            { model | actions = recorded :: model.actions, seed = Random.initialSeed value }


view : Model -> Browser.Document Msg
view model =
    let
        showTools =
            model.session /= SharedSession && model.problem == Nothing
    in
    { title = "Dice Roller (v" ++ version ++ ")"
    , body =
        [ div [ class "app-shell", attribute "data-theme" (themeToString model.preferences.theme) ]
            [ viewHeader model
            , main_ [ class "page" ]
                [ viewSession model
                , viewSaveIssue model
                , div [ class "workspace" ]
                    [ if showTools then
                        viewToolTabs model.preferences.tool

                      else
                        text ""
                    , if showTools then
                        div [ class "workspace-controls" ] (List.map (viewToolPanel model << Tuple.first) tools)

                      else
                        text ""
                    , div [ class "workspace-output" ]
                        [ viewResult model
                        , viewHistory model
                        ]
                    ]
                ]
            , viewTableDialog model
            , viewShareDialog model
            , viewClearDialog model
            ]
        ]
    }


viewHeader : Model -> Html Msg
viewHeader model =
    header [ class "topbar" ]
        [ div [ class "topbar-inner" ]
            [ div [ class "brand" ]
                [ img [ class "brand-icon", src "favicon-32x32.png", alt "", width 32, height 32 ] []
                , h1 [] [ text "Dice Roller" ]
                ]
            , div [ class "header-actions" ]
                [ button
                    [ type_ "button"
                    , class "secondary"
                    , onClick (OpenDialog "share-dialog")
                    , disabled (not model.seedReady || model.problem /= Nothing)
                    ]
                    [ text "Share" ]
                , details [ class "session-menu" ]
                    [ summary [] [ text "Session" ]
                    , div [ class "session-menu-content" ]
                        [ viewTheme model.preferences
                        , if canEdit model then
                            button [ type_ "button", class "menu-action", onClick (OpenDialog "clear-dialog") ]
                                [ text "Clear history…" ]

                          else
                            text ""
                        , small [ class "muted" ] [ text ("Version " ++ version) ]
                        ]
                    ]
                ]
            ]
        ]


viewTheme : Preferences -> Html Msg
viewTheme prefs =
    div [ class "field" ]
        [ label [ for "theme" ] [ text "Theme" ]
        , select [ id "theme", onInput (\value -> SetPreferences { prefs | theme = themeFromString value }) ]
            (List.map
                (\( theme, name ) ->
                    option [ value (themeToString theme), selected (theme == prefs.theme) ] [ text name ]
                )
                [ ( Auto, "System" ), ( Light, "Light" ), ( Dark, "Dark" ) ]
            )
        ]


viewSession : Model -> Html Msg
viewSession model =
    let
        back =
            button [ type_ "button", class "secondary", onClick BackToOwnSession ] [ text "My session" ]
    in
    case model.problem of
        Just InvalidLink ->
            sessionBanner "Shared link unavailable" "This link could not be opened." [ back ]

        Just MissingCopy ->
            sessionBanner "Session copy unavailable" "This copy is stored in the browser that created it." [ back ]

        Just (NewerFormat storedVersion) ->
            sessionBanner "Newer version detected"
                ("This session uses format " ++ String.fromInt storedVersion ++ ". Try updating Dice Roller to open it.")
                [ button [ type_ "button", class "secondary", onClick UpdateApp ] [ text "Update and reload" ]
                , if model.session == OwnSession then
                    button [ type_ "button", class "secondary", onClick (OpenDialog "clear-dialog") ] [ text "Start a new session…" ]

                  else
                    back
                ]

        Nothing ->
            case model.session of
                OwnSession ->
                    text ""

                SessionCopy ->
                    sessionBanner "Session copy" "Changes in this copy are saved separately." [ back ]

                SharedSession ->
                    sessionBanner "Shared session"
                        (countLabel (List.length model.history) "result" ++ " in this snapshot.")
                        [ button [ type_ "button", class "primary", onClick SaveAsCopy ] [ text "Continue as a copy" ]
                        , back
                        ]


sessionBanner : String -> String -> List (Html Msg) -> Html Msg
sessionBanner heading description actions =
    section [ class "session-banner" ]
        [ div []
            [ h2 [] [ text heading ]
            , p [ class "muted" ] [ text description ]
            ]
        , div [ class "button-row" ] actions
        ]


viewSaveIssue : Model -> Html Msg
viewSaveIssue model =
    case model.saveIssue of
        Just message ->
            div [ class "notice" ]
                [ p [ attribute "role" "status" ] [ text message ]
                , if canEdit model then
                    button [ type_ "button", class "secondary", onClick SaveAsCopy ] [ text "Save as a copy" ]

                  else
                    text ""
                ]

        Nothing ->
            text ""


tools : List ( Tool, String )
tools =
    [ ( DiceTool, "Dice" ), ( WordTool, "Words" ), ( IconTool, "Pictograms" ) ]


toolTabId : Tool -> String
toolTabId tool =
    "tool-tab-" ++ toolName tool


toolPanelId : Tool -> String
toolPanelId tool =
    "tool-panel-" ++ toolName tool


viewToolTabs : Tool -> Html Msg
viewToolTabs activeTool =
    let
        count =
            List.length tools

        tab index ( tool, label_ ) =
            let
                active =
                    activeTool == tool

                target key =
                    case key of
                        "ArrowLeft" ->
                            Just (modBy count (index - 1))

                        "ArrowRight" ->
                            Just (modBy count (index + 1))

                        "Home" ->
                            Just 0

                        "End" ->
                            Just (count - 1)

                        _ ->
                            Nothing

                onKey =
                    D.field "key" D.string
                        |> D.andThen
                            (\key ->
                                case target key |> Maybe.andThen (\position -> List.head (List.drop position tools)) of
                                    Just ( next, _ ) ->
                                        D.succeed ( SelectTool next, True )

                                    Nothing ->
                                        D.fail "Not a tab navigation key"
                            )
            in
            button
                [ id (toolTabId tool)
                , type_ "button"
                , attribute "role" "tab"
                , attribute "aria-selected" (boolString active)
                , attribute "aria-controls" (toolPanelId tool)
                , tabindex (if active then 0 else -1)
                , onClick (SelectTool tool)
                , preventDefaultOn "keydown" onKey
                ]
                [ text label_ ]
    in
    div [ class "modes", attribute "role" "tablist", attribute "aria-label" "Tools" ]
        (List.indexedMap tab tools)


viewToolPanel : Model -> Tool -> Html Msg
viewToolPanel model tool =
    let
        active =
            model.preferences.tool == tool
    in
    div
        [ id (toolPanelId tool)
        , attribute "role" "tabpanel"
        , attribute "aria-labelledby" (toolTabId tool)
        , hidden (not active)
        ]
        (if active then
            [ viewToolForm model ]

         else
            []
        )


viewToolForm : Model -> Html Msg
viewToolForm model =
    let
        prefs =
            model.preferences

        primaryLabel =
            case prefs.tool of
                DiceTool ->
                    case toolAction prefs of
                        Just action ->
                            "Roll " ++ actionLabel action

                        Nothing ->
                            if prefs.resultMode == AllDice then
                                "Roll"

                            else
                                "Roll " ++ resultModeName prefs.resultMode

                WordTool ->
                    "Ask"

                IconTool ->
                    "Show icons"
    in
    Html.form [ class "tool-form", onSubmit RunTool ]
        [ case prefs.tool of
            DiceTool ->
                viewDice model

            WordTool ->
                div [ class "table-choice" ]
                    [ div []
                        [ p [ class "muted" ] [ text "Mythic 2e table" ]
                        , strong [] [ text (tableName prefs.table) ]
                        ]
                    , button [ type_ "button", class "secondary", onClick (OpenDialog "table-dialog") ]
                        [ text "Change table" ]
                    ]

            IconTool ->
                div [ class "icon-controls" ]
                    [ numericField "icon-amount" "Pictogram count" prefs.iconAmount model.validation (Just "pictograms")
                        (\value -> SetPreferences { prefs | iconAmount = value })
                    , viewCatalogStatus model.catalog
                    ]
        , button
            [ type_ "submit"
            , class "primary"
            , disabled (not (canEdit model) || (prefs.tool == IconTool && not (iconAvailable model)))
            ]
            [ text primaryLabel ]
        ]


viewDice : Model -> Html Msg
viewDice model =
    let
        prefs =
            model.preferences

        preset sides =
            let
                value_ =
                    String.fromInt sides
            in
            button
                [ type_ "button"
                , attribute "aria-pressed" (boolString (not prefs.custom && prefs.sides == value_))
                , onClick (SetPreferences { prefs | sides = value_, custom = False })
                ]
                [ text ("d" ++ value_) ]
    in
    div [ class "dice-controls" ]
        [ fieldset []
            [ legend [] [ text "Die type" ]
            , div [ class "presets" ]
                (List.map preset [ 4, 6, 8, 10, 12, 20, 100 ]
                    ++ [ button
                            [ type_ "button"
                            , attribute "aria-pressed" (boolString prefs.custom)
                            , onClick (SetPreferences { prefs | custom = True })
                            ]
                            [ text "Custom" ]
                       ]
                )
            ]
        , div [ class "dice-fields" ]
            [ numericField "dice-amount" "Dice count" prefs.amount model.validation (Just "dice")
                (\value_ -> SetPreferences { prefs | amount = value_ })
            , if prefs.custom then
                numericField "dice-sides" "Sides" prefs.sides model.validation Nothing
                    (\value_ -> SetPreferences { prefs | sides = value_ })

              else
                text ""
            , label [ class "check-field" ]
                [ input
                    [ type_ "checkbox"
                    , checked prefs.explode
                    , onCheck (\value_ -> SetPreferences { prefs | explode = value_ })
                    ]
                    []
                , text "Exploding"
                ]
            ]
        , div [ class "result-options" ]
            [ p [ id "dice-result-mode", class "field-label" ] [ text "Result" ]
            , div [ class "result-modes", attribute "role" "radiogroup", attribute "aria-labelledby" "dice-result-mode" ]
                (List.map
                    (\( mode, label_ ) ->
                        label [ class "result-option" ]
                            [ input
                                [ type_ "radio"
                                , name "dice-result-mode"
                                , checked (prefs.resultMode == mode)
                                , onCheck (\_ -> SetPreferences { prefs | resultMode = mode })
                                ]
                                []
                            , span [] [ text label_ ]
                            ]
                    )
                    resultModes
                )
            ]
        ]


numericField : String -> String -> String -> Bool -> Maybe String -> (String -> Msg) -> Html Msg
numericField id_ name current validate stepper change =
    let
        invalid =
            validate && positiveInt current == Nothing

        editor =
            input
            ([ id id_
             , type_ "text"
             , attribute "inputmode" "numeric"
             , autocomplete False
             , value current
             , onInput change
             ]
                ++ (if invalid then
                        [ attribute "aria-invalid" "true", attribute "aria-describedby" (id_ ++ "-error") ]

                    else
                        []
                   )
            )
            []

        number =
            positiveInt current

        step label_ glyph delta blocked =
            button
                [ type_ "button"
                , attribute "aria-label" label_
                , disabled blocked
                , onClick (change (number |> Maybe.map (\n -> n + delta) |> Maybe.withDefault 1 |> String.fromInt))
                ]
                [ text glyph ]
    in
    div [ class "field numeric-field" ]
        [ label [ for id_ ] [ text name ]
        , case stepper of
            Just unit ->
                div [ class "quantity-stepper" ]
                    [ step ("Fewer " ++ unit) "−" (-1) (Maybe.withDefault 1 number <= 1)
                    , editor
                    , step ("More " ++ unit) "+" 1 (number == Just 2147483647)
                    ]

            Nothing ->
                editor
        , if invalid then
            p [ id (id_ ++ "-error"), class "field-error", attribute "role" "alert" ]
                [ text "Enter a positive whole number up to 2,147,483,647." ]

          else
            text ""
        ]


viewCatalogStatus : Catalog -> Html Msg
viewCatalogStatus catalog =
    case catalog of
        CatalogLoading ->
            p [ class "muted", attribute "role" "status" ] [ text "Loading pictograms…" ]

        CatalogFailed ->
            div [ class "catalog-status" ]
                [ p [ attribute "role" "status" ] [ text "Pictograms are unavailable." ]
                , button [ type_ "button", class "secondary", onClick RetryCatalog ] [ text "Retry" ]
                ]

        CatalogReady _ ->
            text ""


viewResult : Model -> Html Msg
viewResult model =
    let
        latest =
            List.head model.history
    in
    section [ class "result-panel", attribute "aria-labelledby" "latest-result" ]
        [ div [ class "result-content", attribute "aria-live" "polite", attribute "aria-atomic" "true" ]
            [ div [ class "result-heading" ]
                [ h2 [ id "latest-result", tabindex -1 ] [ text "Latest result" ]
                , case latest of
                    Just item ->
                        p [ class "result-meta" ] [ text (actionLabel item.action) ]

                    Nothing ->
                        text ""
                ]
            , case latest of
                Just item ->
                    div [ class "result-value" ]
                        [ span [ class "sr-only" ] [ text ("Result " ++ String.fromInt (List.length model.history) ++ ". ") ]
                        , viewEntry False model.catalog item.result
                        ]

                Nothing ->
                    p [ class "result-empty" ]
                        [ span [ attribute "aria-hidden" "true" ] [ text "—" ]
                        , span [ class "sr-only" ] [ text "No result yet." ]
                        ]
            ]
        ]


viewHistory : Model -> Html Msg
viewHistory model =
    let
        count =
            List.length model.history

        visible =
            if model.showHistory then
                model.history

            else
                List.take 3 model.history

        rows =
            List.indexedMap
                (\index item -> ( String.fromInt (count - index), viewHistoryItem model item ))
                visible
    in
    if count == 0 then
        text ""

    else
        aside [ class "history-panel", attribute "aria-labelledby" "history-heading" ]
            [ h2 [ id "history-heading" ] [ text "History" ]
            , Html.Keyed.node "ol" [ class "history-list", id "history-list" ] rows
            , if count > 3 then
                button
                    [ type_ "button"
                    , class "secondary history-toggle"
                    , attribute "aria-expanded" (boolString model.showHistory)
                    , attribute "aria-controls" "history-list"
                    , onClick ToggleHistory
                    ]
                    [ text
                        (if model.showHistory then
                            "Show recent results"

                         else
                            "View all " ++ String.fromInt count ++ " results"
                        )
                    ]

              else
                text ""
            ]


viewHistoryItem : Model -> HistoryItem -> Html Msg
viewHistoryItem model item =
    li [ class "history-item" ]
        [ div [ class "history-content" ]
            [ p [ class "history-meta" ]
                [ text (actionLabel item.action)
                , node "time"
                    [ attribute "datetime" (String.replace " " "T" (formatTimestamp Time.utc item.timestamp) ++ "Z") ]
                    [ text (formatTimestamp model.zone item.timestamp) ]
                ]
            , viewEntry True model.catalog item.result
            ]
        , if canEdit model then
            button
                [ type_ "button"
                , class "secondary repeat"
                , attribute "aria-label" ("Repeat " ++ actionLabel item.action)
                , disabled (not (allowed model item.action))
                , onClick (Repeat item.action)
                ]
                [ text "Repeat" ]

          else
            text ""
        ]


viewEntry : Bool -> Catalog -> Entry -> Html Msg
viewEntry compact catalog entry =
    case entry of
        DiceResult mode dice ->
            let
                totals =
                    List.map List.sum dice

                aggregate =
                    case mode of
                        AllDice ->
                            Nothing

                        Highest ->
                            List.maximum totals

                        Lowest ->
                            List.minimum totals

                        Sum ->
                            Just (List.sum totals)

                kept =
                    if mode == Highest || mode == Lowest then
                        aggregate |> Maybe.andThen (\score -> List.Extra.findIndex ((==) score) totals)

                    else
                        Nothing

                group index die =
                    span [ classList [ ( "die-group", True ), ( "kept", kept == Just index ) ] ]
                        [ if kept == Just index then
                            span [ class "kept-marker" ]
                                [ span [ attribute "aria-hidden" "true" ] [ text "✓" ]
                                , span [ class "sr-only" ] [ text "Kept die: " ]
                                ]

                          else
                            text ""
                        , text (String.join " + " (List.map String.fromInt die))
                        ]
            in
            div [ class "dice-result" ]
                [ case aggregate of
                    Just score ->
                        p [ class "aggregate-result" ]
                            [ text (String.fromInt score) ]

                    Nothing ->
                        text ""
                , div [ classList [ ( "dice-values", True ), ( "dice-breakdown", aggregate /= Nothing ) ] ]
                    (List.indexedMap group dice)
                , if mode == AllDice && not compact && (List.length dice > 1 || List.any (\die -> List.length die > 1) dice) then
                    p [ class "result-meta" ] [ text ("Total " ++ String.fromInt (List.sum totals)) ]

                  else
                    text ""
                ]

        WordResult word ->
            p [ class "word-result" ] [ text word ]

        IconResult indices ->
            case catalog of
                CatalogReady paths ->
                    let
                        pictures =
                            List.filterMap (\index -> Array.get index paths) indices
                    in
                    if compact && List.length pictures > 3 then
                        div [ class "pictogram-preview" ]
                            [ div [ class "pictograms" ] (List.map (viewPictogram True) (List.take 3 pictures))
                            , details [ class "extra-pictograms" ]
                                [ summary [] [ text ("Show " ++ String.fromInt (List.length pictures - 3) ++ " more") ]
                                , div [ class "pictograms" ] (List.map (viewPictogram True) (List.drop 3 pictures))
                                ]
                            ]

                    else
                        div [ class "pictograms" ] (List.map (viewPictogram compact) pictures)

                CatalogLoading ->
                    p [ class "muted" ] [ text "Loading pictograms…" ]

                CatalogFailed ->
                    p [ class "muted" ] [ text "Pictograms unavailable" ]


viewPictogram : Bool -> String -> Html Msg
viewPictogram lazy path =
    let
        name =
            path
                |> String.split "/"
                |> List.reverse
                |> List.head
                |> Maybe.withDefault "Pictogram"
                |> String.replace ".svg" ""
                |> String.replace "-" " "
    in
    img
        ([ class "pictogram", src path, alt name, title name ]
            ++ (if lazy then
                    [ attribute "loading" "lazy" ]

                else
                    []
               )
        )
        []


diceNotation : Int -> Int -> Bool -> String
diceNotation sides amount explode =
    String.fromInt amount
        ++ "d"
        ++ String.fromInt sides
        ++ (if explode then
                "!"

            else
                ""
           )


tableName : String -> String
tableName name =
    name
        |> String.replace "Mythic 2e: Elements - " ""
        |> String.replace "Mythic 2e: " ""
        |> String.replace "Descritions" "Descriptions"


actionLabel : Action -> String
actionLabel action =
    case action of
        RollAction sides amount explode mode ->
            (if mode == AllDice then
                ""

             else
                resultModeName mode ++ " "
            )
                ++ diceNotation sides amount explode

        AskAction name ->
            tableName name

        ShowAction amount ->
            countLabel amount "pictogram"

        ClearAction ->
            "Clear history"

        ResetSeed _ ->
            "Reset seed"


countLabel : Int -> String -> String
countLabel amount name =
    String.fromInt amount ++ " " ++ name ++ (if amount == 1 then "" else "s")


boolString : Bool -> String
boolString value_ =
    if value_ then
        "true"

    else
        "false"


viewTableDialog : Model -> Html Msg
viewTableDialog model =
    let
        recent =
            model.preferences.table
                :: List.filterMap
                    (\item ->
                        case item.action of
                            AskAction name ->
                                Just name

                            _ ->
                                Nothing
                    )
                    model.actions
                |> List.filter (\name -> Dict.member name tables)
                |> List.Extra.unique
                |> List.take 4

        query =
            String.toLower (String.trim model.tableQuery)

        names =
            Dict.keys tables
                |> List.filter (\name -> String.contains query (String.toLower (tableName name)))
                |> List.filter (\name -> query /= "" || not (List.member name recent))

        options choices =
            ul [ class "table-options" ]
                (List.map
                    (\name ->
                        li []
                            [ button
                                [ type_ "button"
                                , class "table-option"
                                , attribute "aria-pressed" (boolString (name == model.preferences.table))
                                , onClick (ChooseTable name)
                                ]
                                [ text (tableName name) ]
                            ]
                    )
                    choices
                )
    in
    node "dialog" [ id "table-dialog", class "dialog table-dialog", attribute "aria-labelledby" "table-dialog-title" ]
        [ div [ class "dialog-heading" ]
            [ h2 [ id "table-dialog-title" ] [ text "Choose a table" ]
            , button [ type_ "button", class "secondary", onClick (CloseDialog "table-dialog") ] [ text "Cancel" ]
            ]
        , div [ class "field" ]
            [ label [ for "table-search" ] [ text "Search Mythic 2e tables" ]
            , input [ id "table-search", type_ "search", attribute "autofocus" "", value model.tableQuery, onInput SearchTables ] []
            ]
        , div [ class "table-results" ]
            [ if query == "" && not (List.isEmpty recent) then
                div []
                    [ h3 [] [ text "Recent" ], options recent ]

              else
                text ""
            , if List.isEmpty names then
                p [ class "muted", attribute "role" "status" ] [ text "No matching tables." ]

              else
                div []
                    [ if query == "" then
                        h3 [] [ text "All tables" ]

                      else
                        text ""
                    , options names
                    ]
            ]
        ]


viewShareDialog : Model -> Html Msg
viewShareDialog model =
    node "dialog" [ id "share-dialog", class "dialog", attribute "aria-labelledby" "share-dialog-title" ]
        [ h2 [ id "share-dialog-title" ] [ text "Share session" ]
        , p [ class "muted" ] [ text "This link opens a snapshot of the results in this session." ]
        , div [ class "field" ]
            [ label [ for "share-link" ] [ text "Session link" ]
            , input [ id "share-link", type_ "text", readonly True, value model.shareLink ] []
            ]
        , p [ attribute "role" "status", class "share-status" ]
            [ text
                (case model.clipboard of
                    Just True ->
                        "Link copied."

                    Just False ->
                        "Copy failed. The link is selected so you can copy it manually."

                    Nothing ->
                        ""
                )
            ]
        , div [ class "dialog-actions" ]
            [ button [ type_ "button", class "secondary", onClick (CloseDialog "share-dialog") ] [ text "Close" ]
            , button [ type_ "button", class "primary", onClick CopyLink ] [ text "Copy link" ]
            ]
        ]


viewClearDialog : Model -> Html Msg
viewClearDialog model =
    let
        replacingNewer =
            model.problem /= Nothing
    in
    node "dialog" [ id "clear-dialog", class "dialog", attribute "aria-labelledby" "clear-dialog-title", attribute "aria-describedby" "clear-dialog-description" ]
        [ h2 [ id "clear-dialog-title" ]
            [ text
                (if replacingNewer then
                    "Start a new session?"

                 else
                    "Clear history?"
                )
            ]
        , p [ id "clear-dialog-description" ]
            [ text
                (if replacingNewer then
                    "This will replace the session stored in this browser."

                 else
                    "This will remove " ++ countLabel (List.length model.history) "result" ++ " and start a new sequence."
                )
            ]
        , div [ class "dialog-actions" ]
            [ button [ type_ "button", class "secondary", attribute "autofocus" "", onClick (CloseDialog "clear-dialog") ] [ text "Cancel" ]
            , button [ type_ "button", class "danger", onClick ConfirmClear ]
                [ text
                    (if replacingNewer then
                        "Start new session"

                     else
                        "Clear history"
                    )
                ]
            ]
        ]
