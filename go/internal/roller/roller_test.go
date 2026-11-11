package roller

import (
	"errors"
	"reflect"
	"testing"
)

func TestReplayAndContinuation(t *testing.T) {
	sequence := New(73)
	actions := []Action{
		{Tag: "roll", Sides: 6, Amount: 5, Explode: true, Mode: All, Timestamp: 1},
		{Tag: "ask", Table: "Mythic 2e: Actions", Timestamp: 2},
		{Tag: "show", IconAmount: 12, Timestamp: 3},
	}
	for _, action := range actions {
		sequence.Record(action, 4180)
	}
	saved, err := DecodeLink(LinkToken(sequence.Archive("dark").Encode()))
	if err != nil {
		t.Fatal(err)
	}
	replayed := Replay(saved, 4180)
	if !reflect.DeepEqual(sequence.History, replayed.History) {
		t.Fatal("replay changed the results")
	}
	for _, action := range actions {
		sequence.Record(action, 4180)
		replayed.Record(action, 4180)
	}
	if !reflect.DeepEqual(sequence.History, replayed.History) {
		t.Fatal("replay changed the continuation")
	}
}

func TestExplosionTotalsAndFirstTie(t *testing.T) {
	for _, check := range []struct {
		mode        Mode
		score, kept int
	}{{Max, 8, 0}, {Min, 1, 1}, {Sum, 10, -1}} {
		result := Result{Action: Action{Mode: check.mode}, Dice: [][]int{{6, 2}, {1}, {1}}}
		score, kept := result.Score()
		if score != check.score || kept != check.kept {
			t.Errorf("%s: got (%d, %d)", check.mode, score, kept)
		}
	}
	sequence := New(73)
	sequence.Record(Action{Tag: "roll", Sides: 1, Amount: 3, Explode: true, Mode: Max}, 4180)
	if !reflect.DeepEqual(sequence.History[0].Dice, [][]int{{1}, {1}, {1}}) {
		t.Fatal("an exploding d1 must stop")
	}
	_, kept := sequence.History[0].Score()
	if kept != 0 {
		t.Fatal("keep the first tied die")
	}
}

func TestRejectForeignAndUnsupportedArchives(t *testing.T) {
	for _, format := range []string{"elm-dice-roller", "gleam-dice-roller", ""} {
		archive := New(73).Archive("auto")
		archive.Format = format
		if _, err := Decode(archive.Encode()); err == nil {
			t.Fatal("accepted foreign format", format)
		}
	}
	for _, version := range []int{0, 1, 3} {
		archive := New(73).Archive("auto")
		archive.Version = version
		_, err := Decode(archive.Encode())
		if err == nil {
			t.Fatal("accepted unsupported version", version)
		}
		var newer NewerVersion
		if errors.As(err, &newer) != (version > Schema) {
			t.Fatal("incorrect recovery for version", version)
		}
	}
}

func TestNumericEditing(t *testing.T) {
	for _, value := range []string{"", "0", "-1", "1.5", "1e3", " 3", "2147483648"} {
		if _, ok := Quantity(value); ok {
			t.Error("accepted invalid quantity", value)
		}
	}
	for _, value := range []string{"1", "12", "2147483647"} {
		if _, ok := Quantity(value); !ok {
			t.Error("rejected valid quantity", value)
		}
	}
}
